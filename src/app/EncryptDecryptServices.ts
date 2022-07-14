
import * as CryptoJS from 'crypto-js';  
/*
AES data encryption is a more mathematically efficient and elegant cryptographic algorithm, 
but its main strength rests in the option for various key lengths.
AES allows you to choose a 128-bit, 192-bit or 256-bit key, 
making it exponentially stronger than the 56-bit key of DES.
AES is comparatively much faster than DES

===> CryptoJS supports AES-128, AES-192, and AES-256. It will pick the variant by the size of the key you pass in. 
If you use a passphrase, then it will generate a 256-bit key.

*/
export class CryptKey {theKey:string=''};
  
export const TableCryptKey: CryptKey[] = [
  {theKey:'MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O'},
  {theKey:'siles moiss;ons1289%^&ne SONT!#[]%$pas bonnes89%^0#(!ALLEZ<>??:a lamaison'},
  {theKey:'LePrince23deGalles89isnot90the=person-wethink3"hecould3be'}
];
export function encrypt(Decrypt:string, key:number, method:string) {
  const myKey=TableCryptKey[key-1].theKey;
  const IV = "MTIzNDU2Nzg=";
  const keyHex = CryptoJS.enc.Utf8.parse(myKey);
  const iv = CryptoJS.enc.Utf8.parse(IV);
  const mode = CryptoJS.mode.CBC;
  var Encrypt='';
  if (method==='DES'){
      // ==== DES
    Encrypt = CryptoJS.TripleDES.encrypt(Decrypt, keyHex, { iv, mode }).toString();
    } else if (method==='AES'){
          // ==== AES
          Encrypt=CryptoJS.AES.encrypt(Decrypt, myKey).toString();
          } 
         //console.log('Encrypt function: decrypt ', Decrypt, 'Method  ', method, 'encrypt', Encrypt);
    return(Encrypt);
  }

  export function decrypt(Encrypt:string, key:number, method:string) {
    const myKey=TableCryptKey[key-1].theKey;
    const IV = "MTIzNDU2Nzg=";
    const keyHex = CryptoJS.enc.Utf8.parse(myKey);
    const iv = CryptoJS.enc.Utf8.parse(IV);
    const mode = CryptoJS.mode.CBC;
    var Decrypt='';
    if (method==='DES'){
      // ==== DES
      Decrypt = CryptoJS.TripleDES.decrypt(Encrypt, keyHex, { iv, mode }).toString(CryptoJS.enc.Utf8);
    } else if (method==='AES'){
          // ==== AES
          Decrypt=CryptoJS.AES.decrypt(Encrypt, myKey).toString(CryptoJS.enc.Utf8);
          } 
          //console.log('Decrypt function: decrypt ', Decrypt, 'Method  ', method, 'encrypt', Encrypt);
    return(Decrypt); 
  }

 