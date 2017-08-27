import KintoneNoteRepositoryConfig from './infrastructure/KintoneNoteRepositoryConfig';


function encodeBase64(str: string): string {
    return new Buffer(str).toString('base64');
}

const myConfig: KintoneNoteRepositoryConfig = new KintoneNoteRepositoryConfig();
// myConfig.cybozuHost = 'kaiichiro-ota-2015.cybozu.com';
myConfig.appId = 135;
// myConfig.xCybozuAuthorization = encodeBase64('kaiichiro:vzr06270');

export default myConfig;
