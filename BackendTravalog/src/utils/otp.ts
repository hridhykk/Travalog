import randomstring from 'randomstring';

function generateOTP(length = 6): string {
  return randomstring.generate({
    length,
    charset: 'numeric',
  });
}

export { generateOTP };