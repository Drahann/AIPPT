import COS from 'cos-nodejs-sdk-v5'

function getCosClient(): COS {
  return new COS({
    SecretId: process.env.COS_SECRET_ID || '',
    SecretKey: process.env.COS_SECRET_KEY || '',
  })
}

/**
 * 上传 Buffer 到腾讯云 COS
 * @param buffer  文件内容
 * @param cosPath COS 上的路径，如 "ppt/reportId/xxx.pptx"
 * @returns 上传后的文件路径（不带域名前缀）
 */
export async function uploadToCOS(buffer: Buffer, cosPath: string): Promise<string> {
  const cos = getCosClient()
  const bucket = process.env.COS_BUCKET || ''
  const region = process.env.COS_REGION || 'ap-shanghai'

  if (!bucket || !process.env.COS_SECRET_ID) {
    throw new Error('[COS] Missing COS_BUCKET or COS_SECRET_ID in environment variables')
  }

  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: cosPath,
        Body: buffer,
      },
      (err) => {
        if (err) {
          console.error('[COS] Upload failed:', err)
          reject(new Error(`COS upload failed: ${err.message}`))
        } else {
          console.log(`[COS] Upload success: ${cosPath}`)
          resolve(cosPath)
        }
      }
    )
  })
}
