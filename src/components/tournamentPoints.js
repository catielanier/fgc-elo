const tournamentPoints = (place, score, players) => {
  if (players < 5) {
    if (place === 1) {
      return score + 6;
    } else if (place === 2) {
      return score + 3;
    } else if (place === 3) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 4 && players < 7) {
    if (place === 1) {
      return score + 9;
    } else if (place === 2) {
      return score + 6;
    } else if (place === 3) {
      return score + 3;
    } else if (place === 4) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 6 && players < 9) {
    if (place === 1) {
      return score + 12;
    } else if (place === 2) {
      return score + 9;
    } else if (place === 3) {
      return score + 6;
    } else if (place === 4) {
      return score + 3;
    } else if (place === 5) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 8 && players < 13) {
    if (place === 1) {
      return score + 15;
    } else if (place === 2) {
      return score + 12;
    } else if (place === 3) {
      return score + 9;
    } else if (place === 4) {
      return score + 6;
    } else if (place === 5) {
      return score + 3;
    } else if (place === 7) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 12 && players < 17) {
    if (place === 1) {
      return score + 20;
    } else if (place === 2) {
      return score + 15;
    } else if (place === 3) {
      return score + 12;
    } else if (place === 4) {
      return score + 9;
    } else if (place === 5) {
      return score + 6;
    } else if (place === 7) {
      return score + 3;
    } else if (place === 9) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 16 && players < 25) {
    if (place === 1) {
      return score + 30;
    } else if (place === 2) {
      return score + 20;
    } else if (place === 3) {
      return score + 15;
    } else if (place === 4) {
      return score + 12;
    } else if (place === 5) {
      return score + 9;
    } else if (place === 7) {
      return score + 6;
    } else if (place === 9) {
      return score + 3;
    } else if (place === 13) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 24 && players < 33) {
    if (place === 1) {
      return score + 40;
    } else if (place === 2) {
      return score + 30;
    } else if (place === 3) {
      return score + 20;
    } else if (place === 4) {
      return score + 15;
    } else if (place === 5) {
      return score + 12;
    } else if (place === 7) {
      return score + 9;
    } else if (place === 9) {
      return score + 6;
    } else if (place === 13) {
      return score + 3;
    } else if (place === 17) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 32 && players < 49) {
    if (place === 1) {
      return score + 60;
    } else if (place === 2) {
      return score + 40;
    } else if (place === 3) {
      return score + 30;
    } else if (place === 4) {
      return score + 20;
    } else if (place === 5) {
      return score + 15;
    } else if (place === 7) {
      return score + 12;
    } else if (place === 9) {
      return score + 9;
    } else if (place === 13) {
      return score + 6;
    } else if (place === 17) {
      return score + 3;
    } else if (place === 25) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 48 && players < 65) {
    if (place === 1) {
      return score + 80;
    } else if (place === 2) {
      return score + 60;
    } else if (place === 3) {
      return score + 40;
    } else if (place === 4) {
      return score + 30;
    } else if (place === 5) {
      return score + 20;
    } else if (place === 7) {
      return score + 15;
    } else if (place === 9) {
      return score + 12;
    } else if (place === 13) {
      return score + 9;
    } else if (place === 17) {
      return score + 6;
    } else if (place === 25) {
      return score + 3;
    } else if (place === 33) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 64 && players < 97) {
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
  } else if (players > 96 && players < 129) {
    if (place === 1) {
      return score + 120;
    } else if (place === 2) {
      return score + 90;
    } else if (place === 3) {
      return score + 70;
    } else if (place === 4) {
      return score + 60;
    } else if (place === 5) {
      return score + 40;
    } else if (place === 7) {
      return score + 30;
    } else if (place === 9) {
      return score + 20;
    } else if (place === 13) {
      return score + 15;
    } else if (place === 17) {
      return score + 12;
    } else if (place === 25) {
      return score + 9;
    } else if (place === 33) {
      return score + 6;
    } else if (place === 49) {
      return score + 3;
    } else if (place === 65) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 128 && players < 193) {
    if (place === 1) {
      return score + 160;
    } else if (place === 2) {
      return score + 120;
    } else if (place === 3) {
      return score + 90;
    } else if (place === 4) {
      return score + 70;
    } else if (place === 5) {
      return score + 60;
    } else if (place === 7) {
      return score + 40;
    } else if (place === 9) {
      return score + 30;
    } else if (place === 13) {
      return score + 20;
    } else if (place === 17) {
      return score + 15;
    } else if (place === 25) {
      return score + 12;
    } else if (place === 33) {
      return score + 9;
    } else if (place === 49) {
      return score + 6;
    } else if (place === 65) {
      return score + 3;
    } else if (place === 97) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 192 && players < 257) {
    if (place === 1) {
      return score + 200;
    } else if (place === 2) {
      return score + 160;
    } else if (place === 3) {
      return score + 120;
    } else if (place === 4) {
      return score + 90;
    } else if (place === 5) {
      return score + 70;
    } else if (place === 7) {
      return score + 60;
    } else if (place === 9) {
      return score + 40;
    } else if (place === 13) {
      return score + 30;
    } else if (place === 17) {
      return score + 20;
    } else if (place === 25) {
      return score + 15;
    } else if (place === 33) {
      return score + 12;
    } else if (place === 49) {
      return score + 9;
    } else if (place === 65) {
      return score + 6;
    } else if (place === 97) {
      return score + 3;
    } else if (place === 129) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 256 && players < 385) {
    if (place === 1) {
      return score + 250;
    } else if (place === 2) {
      return score + 200;
    } else if (place === 3) {
      return score + 160;
    } else if (place === 4) {
      return score + 120;
    } else if (place === 5) {
      return score + 90;
    } else if (place === 7) {
      return score + 70;
    } else if (place === 9) {
      return score + 60;
    } else if (place === 13) {
      return score + 40;
    } else if (place === 17) {
      return score + 30;
    } else if (place === 25) {
      return score + 20;
    } else if (place === 33) {
      return score + 15;
    } else if (place === 49) {
      return score + 12;
    } else if (place === 65) {
      return score + 9;
    } else if (place === 97) {
      return score + 6;
    } else if (place === 129) {
      return score + 3;
    } else if (place === 193) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 384 && players < 513) {
    if (place === 1) {
      return score + 300;
    } else if (place === 2) {
      return score + 250;
    } else if (place === 3) {
      return score + 200;
    } else if (place === 4) {
      return score + 160;
    } else if (place === 5) {
      return score + 120;
    } else if (place === 7) {
      return score + 90;
    } else if (place === 9) {
      return score + 70;
    } else if (place === 13) {
      return score + 60;
    } else if (place === 17) {
      return score + 40;
    } else if (place === 25) {
      return score + 30;
    } else if (place === 33) {
      return score + 20;
    } else if (place === 49) {
      return score + 15;
    } else if (place === 65) {
      return score + 12;
    } else if (place === 97) {
      return score + 9;
    } else if (place === 129) {
      return score + 6;
    } else if (place === 193) {
      return score + 3;
    } else if (place === 257) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 512 && players < 769) {
    if (place === 1) {
      return score + 400;
    } else if (place === 2) {
      return score + 300;
    } else if (place === 3) {
      return score + 250;
    } else if (place === 4) {
      return score + 200;
    } else if (place === 5) {
      return score + 160;
    } else if (place === 7) {
      return score + 120;
    } else if (place === 9) {
      return score + 90;
    } else if (place === 13) {
      return score + 70;
    } else if (place === 17) {
      return score + 60;
    } else if (place === 25) {
      return score + 40;
    } else if (place === 33) {
      return score + 30;
    } else if (place === 49) {
      return score + 20;
    } else if (place === 65) {
      return score + 15;
    } else if (place === 97) {
      return score + 12;
    } else if (place === 129) {
      return score + 9;
    } else if (place === 193) {
      return score + 6;
    } else if (place === 257) {
      return score + 3;
    } else if (place === 385) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else if (players > 768 && players < 1025) {
    if (place === 1) {
      return score + 500;
    } else if (place === 2) {
      return score + 400;
    } else if (place === 3) {
      return score + 300;
    } else if (place === 4) {
      return score + 250;
    } else if (place === 5) {
      return score + 200;
    } else if (place === 7) {
      return score + 160;
    } else if (place === 9) {
      return score + 120;
    } else if (place === 13) {
      return score + 90;
    } else if (place === 17) {
      return score + 70;
    } else if (place === 25) {
      return score + 60;
    } else if (place === 33) {
      return score + 40;
    } else if (place === 49) {
      return score + 30;
    } else if (place === 65) {
      return score + 20;
    } else if (place === 97) {
      return score + 15;
    } else if (place === 129) {
      return score + 12;
    } else if (place === 193) {
      return score + 9;
    } else if (place === 257) {
      return score + 6;
    } else if (place === 385) {
      return score + 3;
    } else if (place === 513) {
      return score + 2;
    } else {
      return score + 1;
    }
  } else {
    if (place === 1) {
      return score + 700;
    } else if (place === 2) {
      return score + 500;
    } else if (place === 3) {
      return score + 400;
    } else if (place === 4) {
      return score + 300;
    } else if (place === 5) {
      return score + 250;
    } else if (place === 7) {
      return score + 200;
    } else if (place === 9) {
      return score + 160;
    } else if (place === 13) {
      return score + 120;
    } else if (place === 17) {
      return score + 90;
    } else if (place === 25) {
      return score + 70;
    } else if (place === 33) {
      return score + 60;
    } else if (place === 49) {
      return score + 40;
    } else if (place === 65) {
      return score + 30;
    } else if (place === 97) {
      return score + 20;
    } else if (place === 129) {
      return score + 15;
    } else if (place === 193) {
      return score + 12;
    } else if (place === 257) {
      return score + 9;
    } else if (place === 385) {
      return score + 6;
    } else if (place === 513) {
      return score + 3;
    } else if (place === 769) {
      return score + 2;
    } else {
      return score + 1;
    }
  }
};

export default tournamentPoints;
