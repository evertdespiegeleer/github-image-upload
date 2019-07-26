import ora from 'ora';
interface Object {
    localPath?: string;
    publicUrl?: string;
}
declare const uploadFn: (username: string, password: string, imgArr: string[], cliSpinner?: ora.Ora | undefined) => Promise<Object[]>;
export { uploadFn as upload };
