const tournamentPoints = (place, score) => {
  if (place === 1) {
    return score + 90;
  } else if (place === 2) {
    return score + 70;
  } else if (place === 3) {
    return score + 60;
  } else if (place === 4) {
    return score + 40;
  } else if (place === 5) {
    return score + 30;
  } else if (place === 7) {
    return score + 20;
  } else if (place === 9) {
    return score + 15;
  } else if (place === 13) {
    return score + 12;
  } else if (place === 17) {
    return score + 9;
  } else if (place === 25) {
    return score + 6;
  } else if (place === 33) {
    return score + 3;
  } else if (place === 49) {
    return score + 2;
  } else {
    return score + 1;
  }
};

export default tournamentPoints;
