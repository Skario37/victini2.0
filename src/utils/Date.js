exports.dhm = (t) => {
  // a day is
  // hour * min * sec * mil 
  // 24 * 60 * 60 * 1000
  const cd = 86400000; // opti
  // an hour is
  // min * sec * mil
  // 60 * 60 * 1000
  const ch = 3600000; // opti
  // a minute is
  // sec * mil
  // 60 * 1000
  const cm = 60000; // opti

  let d = Math.floor(t / cd);
  let h = Math.floor((t - d * cd) / ch);
  let m = Math.floor((t - d * cd - h * ch) / cm);
  let s = Math.round((t - d * cd - h * ch - m * cm) / 1000);
  const pad = function(n){ return n < 10 ? '0' + n : n; };
  if (s === 60){ m++;  s = 0; }
  if (m === 60){ h++;  m = 0; }
  if (h === 24){ d++;  h = 0; }
  
  return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}