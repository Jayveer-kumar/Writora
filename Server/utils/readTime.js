const WORDS_PER_MINUTE = 200; // average reading speed

function calculateReadTime(wordCount) {
  if (!wordCount || wordCount <= 0) return 1; // minimum 1 min 
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return minutes;
}

export { calculateReadTime };