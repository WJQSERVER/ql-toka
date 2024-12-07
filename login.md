# 账户密码登录 API 文档

## 接口路径

`/api/pwd_login`

## 请求方法

支持以下请求方法：

- `GET`
- `POST`

## 请求参数

在请求中需要包含以下参数：

- **phone**: 用户的手机号码，格式应为有效的手机号码。
- **password**: 用户的密码，确保遵循安全性最佳实践，如包含字母、数字和特殊字符。

## 示例请求

### GET 请求示例

```http
GET /api/pwd_login?phone=12345678901&password=mySecurePassword
```

## 响应说明

成功的响应将包含用户的登录状态和相关信息，返回格式可能如下：

```json
{
  "err_code": ,
  "err_msg": "",
  "jmp_url": "",
  "pt_key": "",
  "pt_pin": ""
}
```

- **err_code**: 错误码，0 表示成功，128 表示风控，其他值表示失败。
- **err_msg**: 错误信息，当 err_code 不为 0 时，会有相应的错误信息。
- **jmp_url**: 跳转链接，当风控时会返回跳转链接，用户可通过跳转链接完成登录。
- **pt_key**: 用户CK
- **pt_pin**: 用户名

### 成功响应示例

```json
{
  "err_code": 0,
  "err_msg": "",
  "jmp_url": "",
  "pt_key": "UserCK",
  "pt_pin": "UserName"
}
```

### 风控响应示例

```json
{
  "err_code": 128,
  "err_msg": "您的账号存在风险，为了账号安全需要短信/语音验证，是否继续？",
  "jmp_url": "https://wxapplogin.m.example.com/h5/risk/select?xxxx",
  "pt_key": "",
  "pt_pin": ""
}
```
