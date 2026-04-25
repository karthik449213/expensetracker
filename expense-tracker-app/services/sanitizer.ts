/**
 * this file for prevention of injection attacks and it is input validation
 */


export class Sanitizer{
    static sanitizeString(input:string):
    string{
        return input.replace(/[<>]/g,'') // removes angle bracekrs
        .replace(/["']/g,'')
        .trim();
    }
    static sanitizeEmail(email:string):string{
        return email.toLowerCase().trim();

    }

    static sanitizeNumber(input:string|number):number{
        const num=parseFloat(String(input));
        return isNaN(num) ? 0: num;

    }

    static validateEmail(email:string):boolean{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);

    }

    
  static validateStrongPassword(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  }
}