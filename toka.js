/**
 * @author wjqserver
 * @name 灯花框架
 * @team wjqserver studio
 * @version 1.0.2
 * @description 灯花(toka)外围组件
 * @rule ^(toka|灯花)
 * @admin false
 * @public false
 * @priority 1
 * @disable false

 */
let TokaFrameUrl = 'http://127.0.0.1:7765'; // 灯花框架地址
/* HideStart */
module.exports = async s => {
    const axios = require('axios')
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    if (s.getMsg() == '灯花') {
        await s.reply('欢迎使用灯花框架，请选择功能：\n1. 京东账号登陆\n2. 续签账户登陆\n');
        // 框架自检
        let frame_check = await checkFrame(TokaFrameUrl);
        if (frame_check === false) {
            await s.reply('无法连接到灯花框架，请检查配置');
            return;
        }
        let choice_input = await s.waitInput(async (s) => {
            if (s.getMsg() === '1') {
                await s.reply('请输入京东账号[手机号/用户名] 输入q随时退出');
                let phone_input = await s.waitInput(async (s) => {
                    if (s.getMsg() === 'q') return s.reply('已退出');
                    let phone = s.getMsg();
                    await s.reply('请输入京东密码 输入q随时退出');
                    let password_input = await s.waitInput(async (s) => {
                        if (s.getMsg() === 'q') return s.reply('已退出');
                        let password = s.getMsg();
                        await s.reply('正在登陆中ing');
                        for (let i = 0; i <= 15; i++) {
                            await wait(1000)
                            let { data: res } = await axios.get(TokaFrameUrl + '/api/pwd_login?phone=' + phone + '&password=' + password)
                            if (res.err_code === 0) {
                                await s.reply(res.err_msg);
                                await s.reply('用户:' + res.pt_pin + '登陆成功');
                                return s.reply('登陆成功')
                            } else if (res.err_code === 128) {
                                // 解码json url
                                const jmp_url_decode = decodeURIComponent(res.jmp_url);
                                await s.reply('您的账号存在安全风险，已被风控,请前往以下链接进行验证：\n ' + jmp_url_decode);
                                await s.reply('请在120秒内完成验证，输入ok继续登陆');
                                let ok_input = await s.waitInput(async (s) => {
                                    if (s.getMsg() === 'ok') {
                                        awaits.reply('正在继续登陆中ing');
                                        let relogin_output = relogin(TokaFrameUrl, phone, password);
                                        return s.reply(relogin_output);
                                    } else {
                                        return s.reply('输入错误，请重新输入');
                                    }
                                });
                            } else {
                                return s.reply('登陆失败，请检查账号密码是否正确');
                            }
                        }
                        return s.reply('登陆失败，请检查账号密码是否正确');
                    }, 30);
                    if (password_input === null) return s.reply('超时退出');
                }, 30);
                if (phone_input === null) return s.reply('超时退出');
                //撤回用户发的信息
            } else if (s.getMsg() === '2') {
                await s.reply('请输入续签账号 [用户名] 输入q随时退出');
                let phone_input = await s.waitInput(async (s) => {
                    if (s.getMsg() === 'q') return s.reply('已退出');
                    let username = s.getMsg();
                    let { data: res } = await axios.get(TokaFrameUrl + '/api/refresh' + '?user=' + username)
                    if (res.err_code === 0) {
                        return s.reply('续签成功');
                    } else {
                        return s.reply(res.err_msg);
                    }
                }, 30);
            };
        }, 30);
    }
}

async function relogin(TokaFrameUrl, phone, password) {
    let { data: res } = awaitaxios.get(TokaFrameUrl + '/api/pwd_login?phone=' + phone + '&password=' + password)
    if (res.err_code === 0) {
        let relogin_msg = '登陆成功';
        return relogin_msg;
    } else {
        let relogin_msg = '登陆失败';
        return relogin_msg;
    }
}

async function checkFrame(TokaFrameUrl) {
    let { data: res } = awaitaxios.get(TokaFrameUrl + '/api/healthcheck')
    // http 状态码 200 正常
    if (res.status === 200) {
        return true;
    } else {
        return false;
    }
}
/* HideEnd */
