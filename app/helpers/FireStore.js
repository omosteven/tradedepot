const cloudinary = require('cloudinary').v2;

const fs = require('fs');

// const {Storage} = require('@google-cloud/storage');

// const storage = new Storage({
//     // keyFilename: <server-key-file-path>,
//     keyFilename: "gs://tradedepot-809fd.appspot.com"
// });

// let bucketName = "gs://tradedepot-809fd.appspot.com"

class FireStore {

    // static async uploadFile (fileName) { // Uploads a local file to the bucket
    //     await storage.bucket(bucketName).upload(fileName, { // Support for HTTP requests made with `Accept-Encoding: gzip`
    //         gzip: true,
    //         // By setting the option `destination`, you can change the name of the
    //         // object you are uploading to a bucket.
    //         metadata: {
    //             // Enable long-lived HTTP caching headers
    //             // Use only if the contents of the file will never change
    //             // (If the contents will change, use cacheControl: 'no-cache')
    //             cacheControl: 'public, max-age=31536000'
    //         }
    //     });
    //     console.log(`${filename} uploaded to ${bucketName}.`);

    // };

    static uploadImage(file, fileName) {
        return new Promise((resolve, reject) => {

            cloudinary.config({cloud_name: 'votexpression', api_key: '671536298516341', api_secret: 'Kyg-re4g8jpNffiSC-UYFKga0Bo'});

            cloudinary.uploader.upload(file, {

                resource_type: "image",

                public_id: fileName,

                overwrite: true,

                notification_url: "https://mysite.example.com/notify_endpoint"

            }, (error, result) => {

                if (error) { // even after failed upload, delete the file
                    fs.unlinkSync("./uploads/" + fileName);
                    reject(false);

                } else { // after successful upload, delete the file
                    fs.unlinkSync("./uploads/" + fileName);
                    resolve(result.secure_url);
                }

            });
        })
    }
};

module.exports = FireStore;
