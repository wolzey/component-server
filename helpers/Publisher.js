const AWS = require('aws-sdk')
const path = require('path')

const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env

const S3 = new AWS.S3({
  aws_access_key_id: AWS_ACCESS_KEY,
  aws_secret_access_key: AWS_SECRET_ACCESS_KEY
})

const fs = require('fs')

module.exports = class ComponentPublisher {
  constructor({ component_directory, default_version = '1.0.0', Bucket = 'component-server' }) {
    this.component_directory = component_directory
    this.default_version = default_version
    this.Bucket = Bucket
  }

  async publish() {
    this.uploadDir(this.component_directory)
  }

  listS3Objects(path = '') {
    return new Promise((resolve) => {
      S3.listObjects({Bucket: this.Bucket, Delimiter: '/', Prefix: 'components/'}, (err, data) => {
        if (err) return console.log(err)
        return resolve(data)
      })
    })
  }

  putS3Object(path) {
    return new Promise((resove) => {
      S3.putObject()
    })
  }

  uploadDir(s3Path) {
    function walkSync(currentDirPath, callback) {
      fs.readdirSync(currentDirPath).forEach((name) => {
        const filePath = path.join(currentDirPath, name)
        const stat = fs.statSync(filePath)
        if (stat.isFile()) {
          return callback(filePath, stat)
        }
        else if (stat.isDirectory()) {
          walkSync(filePath, callback)
        }
      })
    }

    walkSync(s3Path, function(filePath, stat) {
      let bucketPath = filePath.substring(s3Path.length+1)
      let params = {Bucket: 'component-server', Key: `components/${bucketPath}`, Body: fs.readFileSync(filePath)}

      S3.putObject(params, (err, data) => {
        if (err) {
          return console.log(err)
        }

        return console.log('Uploaded to s3', `components/${bucketPath}`)
      })
    })
  }
}
