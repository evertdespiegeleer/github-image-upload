interface Object {
    localPath?: string;
    publicUrl?: string;
}
declare const uploadFn: (username: string, password: string, imgArr: string[], cliSpinner?: any) => Promise<Object[]>;
export { uploadFn as upload };
