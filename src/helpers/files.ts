
import fs from 'fs';
import path from 'path';

export const base64File = (encoded:string) : object =>  {
  const matches = encoded.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches) return new Error('Invalid')

  if (matches.length !== 3)
  {
    return new Error('Invalid input string');
  }


  return {type:matches[1],data: Buffer.from(matches[2],'base64')};
}

export const createorUpdateFile = (b:Buffer,ext:string,nameFile:string,folder:string ):string =>{
  const resolveFolderPath = path.resolve(folder);
  const fullPathFile = resolveFolderPath+ '/'+nameFile.toString()+'.'+ext.toString();
  fs.access(fullPathFile,err =>{
    if (err){
       fs.writeFile(fullPathFile,b,{encoding:'binary'},err1 =>{
         if (err){
           console.log('No pudo escribirse el archivo',err1);
         }
       });
    }
    fs.unlink(fullPathFile,err1 => {
      if (err1) console.log('No existe');
      console.log('Borrado exitosamente');
    })
    fs.writeFile(fullPathFile,b,{encoding:'binary'},err2=>{
      if (err2){
        console.log('No pudo escribirse el archivo',err2);
      }
      console.log('Archivo guardado');
    });
  })

  return nameFile.toString()+'.'+ext.toString();
}