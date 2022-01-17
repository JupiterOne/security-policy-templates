const mime = require("mime-types");
const baseDeploy = require("jupiterone-deploy");
const walkDir = baseDeploy.util.fs.walkDir;
const formatBytes = require("bytes");
const pAll = require("p-all");
const fs = require("fs").promises;

exports.afterDeployTerraform = async (env) => {
  const S3_BUCKET = `${env["name"]}-security-policy-templates`;
  const AWS = baseDeploy.getAws().getAwsSdk();
  const s3 = new AWS.S3();
  const config = baseDeploy.getConfig();
  const templatesDir = config.getProjectDir() + "/templates/";
  const assets = [];

  await walkDir(templatesDir, {
    async onFile(file, stat) {
      // Sanity check before blindly removing the prefix by length below
      if (!file.startsWith(templatesDir)) {
        throw new Error(
          `The file ${file} did not start with the expected path ${templatesDir}`
        );
      }
      assets.push({
        fullPath: file,
        relativePath: file.substring(templatesDir.length),
        contentType: mime.lookup(file) || "text/plain",
      });
    },
  });

  console.log("Number of static assets: " + assets.length);
  console.log("Uploading static assets to S3...");

  const uploadAsset = async (asset) => {
    const { body, encoding } = asset;
    const key = asset.relativePath;
    try {
      await s3
        .upload({
          Bucket: S3_BUCKET,
          ContentType: asset.contentType,
          ContentEncoding: encoding,
          Body: body,
          Key: key,
          ServerSideEncryption: "AES256",
        })
        .promise();

      const fileSizeStr = formatBytes(body.length, {
        decimalPlaces: 2,
        thousandsSeparator: ",",
        unitSeparator: " ",
      });
      console.log(`Uploaded ${key} (${fileSizeStr} ${encoding || ""})`);
    } catch (err) {
      console.error(
        `Error uploading ${asset.relativePath}! ${err.stack || err.toString()}`
      );
      throw err;
    }
  };

  const work = [];

  for (const asset of assets) {
    // Read the file contents for this asset...
    const fileContents = await fs.readFile(asset.fullPath, {
      encoding: "utf8",
    });
    work.push(async () => {
      // Upload uncompressed version
      await uploadAsset({
        ...asset,
        body: fileContents,
      });
    });
  }

  console.log("Number of uploads pending: " + work.length);

  await pAll(work, { concurrency: 4 });

  console.log("Finished uploading static assets to S3.");

  const getAllObjectsInBucket = async (objectsList, token) => {
    const result = await s3
      .listObjectsV2({ Bucket: S3_BUCKET, ContinuationToken: token })
      .promise();
    const newList = [...objectsList, ...result.Contents];

    return result.IsTruncated
      ? getAllObjectsInBucket(newList, result.NextContinuationToken)
      : newList;
  };

  const s3Objects = await getAllObjectsInBucket([]);

  // Remove items from S3 that are no longer in the repo
  const objectsToRemove = [];
  for (const obj of s3Objects) {
    try {
      await fs.access(templatesDir + obj.Key);
    } catch (err) {
      console.log("Deleting ", obj.Key);
      objectsToRemove.push(obj.Key);
    }
  }

  const removalWork = objectsToRemove.map((key) => {
    console.log("Removing the following from S3:", key);
    const promise = s3.deleteObject({ Bucket: S3_BUCKET, Key: key }).promise();
    return promise;
  });

  await pAll(removalWork, { concurrency: 4 });
};
