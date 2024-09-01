import AWS from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';
import dotenv from 'dotenv';

const randomBytes = promisify(crypto.randomBytes);
dotenv.config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION, // Replace with your actual AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Hardcoded access key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Hardcoded secret access key
  signatureVersion: 'v4',
});

export async function generateUploadURL() {
  try {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = {
      Bucket: 'direct-upload-dump', // Replace with your actual bucket name
      Key: imageName,
      Expires: 60, // URL valid for 60 seconds
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw new Error('Could not generate upload URL');
  }
}

export async function listObjects() {
  try {
    const params = {
      Bucket: 'direct-upload-dump', // Replace with your actual bucket name
    };

    const data = await s3.listObjectsV2(params).promise();
    return data.Contents.map(obj => obj.Key);
  } catch (error) {
    console.error('Error listing objects:', error);
    throw new Error('Could not list objects');
  }
}
