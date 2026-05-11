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
    .replace(/&lt;/g, '') // Remove encoded HTML tags
    .replace(/&gt;/g, '') // Remove encoded HTML tags
    .replace(/&amp;/g, '&') // Decode valid ampersands
    .replace(/&#\d+;/g, '') // Remove HTML entities
    .replace(/&#x[0-9a-f]+;/gi, '') // Remove hex HTML entities
    .replace(/eval\(/gi, '') // Remove eval calls
    .replace(/Function\(/gi, '') // Remove Function constructor
    .replace(/setTimeout\(/gi, '') // Remove setTimeout
    .replace(/setInterval\(/gi, '') // Remove setInterval
    .trim();
};
