const JWT = require('jsonwebtoken')

exports.verifyEmail = (email, name) => {
    const token = JWT.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30m',
    })
    return `
    <html>
    
    <head>
        <title>Verify Email BTL86</title>
        <style>
            h2, p, a {
                font-family: Arial, Helvetica, sans-serif;
                text-align: justify;
            }

            h2 {
                color: #222222;
                font-size: 20px;
            }
    
            p {
                color: #222222;
                font-size: 15px;
                line-height: 1.5em;
            }
    
            a {
                font-size: 15px;
                color: black !important;
                text-decoration: none;
                font-weight: bold;
            }
    
            .button {
                padding: 10px 25px;
                text-align: center;
                border-style: solid;
                border-color: transparent;
                background: #ffd701;
                border-width: 0px;
                display: inline-block;
                border-radius: 5px;
                width: auto;
            }
    
            .button:hover {
                background: #f9aa00;
            }
    
            table {
                width: 50%;
                margin: 0 auto;
            }
    
            td {
                padding-left: 20px;
                padding-right: 20px;
            }
    
            @media screen and (max-width: 768px) {
                h2 {
                    font-size: 15px;
                }
    
                p a {
                    font-size: 12px;
                }
    
                .button {
                    padding: 7px 12px;
                    border-radius: 5px;
                }
    
                table {
                    width: 70%;
                }
    
                td {
                    padding-left: 15px;
                    padding-right: 15px;
                }
            }
    
            @media screen and (max-width: 480px) {
                h2 {
                    font-size: 15px;
                }
    
                p a {
                    font-size: 5px;
                }
    
                .button {
                    padding: 3px 8px;
                    border-radius: 5px;
                }
    
                table {
                    width: 90%;
                }
    
                td {
                    padding-left: 10px;
                    padding-right: 10px;
                }
            }
        </style>
    </head>
    
    <body>
        <table>
            <tr>
                <td colspan="1" style="background-color: rgb(17,24,64); text-align: left; padding: 5px 10px;">
                    <img src="https://i.ibb.co/BPRL6Wn/logo111.png" alt="BTL86 Logo" width=85px height=40px>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">
                    <h2 style="text-align: center;">Email Verification - BTL86</h2>
                    <p>Welcome to BTL86! Verify your email to start.</p>
                    <p>Dear ${name}</p>
                    <p>Congratulations on successfully registering as a student in our BTL86! To start learning and exploringour platform, please verify your email by clicking on the link:</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    <span class="button">
                        <a href="${process.env.BASE_URL}/auth/verify-email?verifyToken=${token}">
                            Confirm email address
                        </a>
                    </span>
                </td>
            </tr>
            <tr>
                <td>
                    <p>If you have trouble accessing the link, please copy and paste it into your browser's address bar.</p>
                    <p>Thank you for choosing BTL86 for your works needs. We hope you enjoy using our platform to achieve your goals.</p>
                    <p>
                        Best regards,
                        <br>
                        BTL86
                    </p>
                </td>
            </tr>
        </table>
    </body>
    
    </html>`
}

exports.verifyEmailSuccess = () => `
<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px; margin-top: 100px;;"> 
    <tbody><tr> 
     <td align="center" valign="top" style="padding:0;Margin:0;width:560px"> 
      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px"> 
        <tbody><tr> 
         <td align="center" style="padding:0;Margin:0;"><h1 style="Margin:0;line-height:36px;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#59ca7e;text-align:center"><b>Registration Successful</b></h1></td> 
        </tr> 
        <tr> 
         <td align="center" style="padding:0;Margin:0"><p style="Margin:0;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;line-height:21px;color:#0f2934;font-size:14px">Let sign in to the app to enjoy!</p></td> 
        </tr>  
        <tr> 
         <td align="center" height="60" style="padding:0;Margin:0"></td> 
        </tr> 
      </tbody></table></td> 
    </tr> 
  </tbody>
</table>`

exports.verifyEmailFail = () => `
<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px; margin-top: 100px;;"> 
    <tbody><tr> 
     <td align="center" valign="top" style="padding:0;Margin:0;width:560px"> 
      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px"> 
        <tbody><tr> 
         <td align="center" style="padding:0;Margin:0;"><h1 style="Margin:0;line-height:36px;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#cf5252;text-align:center"><b>Registration Fail</b></h1></td> 
        </tr> 
        <tr> 
         <td align="center" style="padding:0;Margin:0"><p style="Margin:0;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;line-height:21px;color:#0f2934;font-size:14px">Oops! The token has expired or the email is incorrect</p></td> 
        </tr>  
        <tr> 
         <td align="center" height="60" style="padding:0;Margin:0"></td> 
        </tr> 
      </tbody></table></td> 
    </tr> 
  </tbody>
</table>`

exports.resetPassword = (email, resetPasswordUrl) => {
    const token = JWT.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30m',
    })
    return `
  <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px; margin-top: 100px;;"> 
    <tbody><tr> 
     <td align="center" valign="top" style="padding:0;Margin:0;width:560px"> 
      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px"> 
        <tbody><tr> 
         <td align="center" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:36px;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#0f2934;text-align:center"><b>Đặt lại mật khẩu cho ứng dụng BTL86</b></h1></td> 
        </tr> 
        <tr> 
         <td align="center" height="40" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="center" style="padding:0;Margin:0"><p style="Margin:0;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;line-height:21px;color:#0f2934;font-size:14px">Xin chào!</p></td> 
        </tr> 
        <tr> 
         <td align="center" height="20" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="center" style="padding:0;Margin:0"><p style="Margin:0;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;line-height:21px;color:#0f2934;font-size:14px">Chúng tôi nhận được yêu cầu lấy lại mật khẩu tại ứng dụng&nbsp;<strong><span style="text-decoration:none;color:#2196f3;font-size:14px" >BTL86</span></strong>,<br>Nếu đúng là bạn đã yêu cầu, vui lòng click nút "Xác Nhận" bên dưới.</p></td> 
        </tr> 
        <tr> 
         <td align="center" height="40" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="center" style="padding:0;Margin:0"><span class="m_1867319716957242505es-button-border" style="border-style:solid;border-color:transparent;background:#e54919;border-width:0px;display:inline-block;border-radius:4px;width:auto"><a href="${resetPasswordUrl}?verifyToken=${token}" class="m_1867319716957242505es-button" style="text-decoration:none;color:#ffffff;font-size:14px;border-style:solid;border-color:#e54919;border-width:12px 40px 12px 40px;display:inline-block;background:#e54919;border-radius:4px;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;font-weight:normal;font-style:normal;line-height:17px;width:auto;text-align:center" target="_blank">Xác Nhận</a></span></td> 
        </tr> 
        <tr> 
         <td align="center" height="60" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="center" height="60" style="padding:0;Margin:0"></td> 
        </tr> 
      </tbody></table></td> 
    </tr> 
  </tbody></table>`
}


