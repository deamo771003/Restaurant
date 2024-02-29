import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// 創建 Secrets Manager 客戶端實例
const client = new SecretsManagerClient({ region: "ap-northeast-1" });

// 定義函數以從 Secrets Manager 獲取秘密
export async function getSecret(secretName) {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    try {
        const response = await client.send(command);
        if (response.SecretString) {
    // 秘密以字符串形式存儲
    const secret = response.SecretString;
    const secretObject = JSON.parse(secret);
    return secretObject;
} else if (response.SecretBinary) {
    // 秘密以二進制形式存儲，將其轉換為字符串
    const secretBinary = response.SecretBinary;
    const secretString = Buffer.from(secretBinary).toString('ascii');
    const secretObject = JSON.parse(secretString);
    return secretObject;
}
    } catch (err) {
        console.error("Unable to retrieve secret:", err);
        return undefined;
    }
}

