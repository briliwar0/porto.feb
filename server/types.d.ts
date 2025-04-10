// Declaration file for modules without types

declare module 'request-ip' {
  import { Request } from 'express';
  
  export function getClientIp(req: Request): string | null;
}