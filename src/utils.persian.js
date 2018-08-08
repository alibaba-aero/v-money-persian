const persianToEnglishMapper = {
  '۱': 1,
  '۲': 2,
  '۳': 3,
  '۴': 4,
  '۵': 5,
  '۶': 6,
  '۷': 7,
  '۸': 8,
  '۹': 9,
  '۰': 0
}

function mapChars(input, mapper) {
  return input.split('').map(char => {
    return mapper[char] || char;
  }).join('');
}

export function persianToEnglish(input) {
  return mapChars(input, persianToEnglishMapper);
}
