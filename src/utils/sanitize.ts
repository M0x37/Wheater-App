export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/file:/gi, '') // Remove file: protocol
    .replace(/ftp:/gi, '') // Remove ftp: protocol
    .trim();
};
