declare module 'formidable-serverless' {
    import { IncomingMessage } from 'http';
  
    // Define the options for the IncomingForm
    interface Options {
      uploadDir?: string;
      keepExtensions?: boolean;
      maxFileSize?: number;
      maxFieldsSize?: number;
      // Add more options as needed
    }
  
    // Define the structure of uploaded files
    interface File {
      newFilename: string;
      originalFilename: string;
      mimetype: string;
      fileSize: number;
      filepath: string;
    }
  
    // Define the structure of form fields
    interface Fields {
      [key: string]: string | string[];
    }
  
    // Define the IncomingForm class (this is what the function returns)
    class IncomingForm {
      constructor(options?: Options);
  
      parse(
        req: IncomingMessage,
        callback: (err: any, fields: Fields, files: { [key: string]: File | File[] }) => void
        // res: NodeJS.WritableStream,
      ): void;
    }
  
    // Export the function that returns an IncomingForm instance
    function formidable(options?: Options): IncomingForm;
  
    export = formidable;
  }