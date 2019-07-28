const findPlace = index => {
  if (index >= 0 && index < 4) {
    return index + 1;
  }
  if (index >= 4 && index < 6) {
    return 5;
  }
  if (index >= 6 && index < 8) {
    return 7;
  }
  if (index >= 8 && index < 12) {
    return 9;
  }
  if (index >= 12 && index < 16) {
    return 13;
  }
  if (index >= 16 && index < 24) {
    return 17;
  }
  if (index >= 24 && index < 32) {
    return 25;
  }
  if (index >= 32 && index < 48) {
    return 33;
  }
  if (index >= 48 && index < 64) {
    return 49;
  }
  if (index >= 64 && index < 96) {
    return 65;
  }
  if (index >= 96 && index < 128) {
    return 97;
  }
  if (index >= 128 && index < 192) {
    return 129;
  }
  if (index >= 192 && index < 256) {
    return 193;
  }
  if (index >= 256 && index < 384) {
    return 257;
  }
  if (index >= 384 && index < 512) {
    return 385;
  }
  if (index >= 512 && index < 768) {
    return 513;
  }
  if (index >= 768 && index < 1024) {
    return 769;
  }
  if (index >= 1024 && index < 1536) {
    return 1025;
  }
  if (index >= 1536 && index < 2048) {
    return 1537;
  }
};

export default findPlace;
