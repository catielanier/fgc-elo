const calculateElo = (playerOne, playerTwo, match) => {
  if (playerOne.name === match.winner_id) {
    playerOne.matchWins = playerOne.matchWins + 1;
    playerTwo.matchLosses = playerTwo.matchLosses + 1;
    const playerOneOriginalELO = playerOne.elo;
    const playerTwoOriginalELO = playerTwo.elo;
    const playerOneTransELO = Math.pow(10, playerOneOriginalELO / 400);
    const playerTwoTransELO = Math.pow(10, playerTwoOriginalELO / 400);
    const playerOneExpectedScore =
      playerOneTransELO / (playerOneTransELO + playerTwoTransELO);
    const playerTwoExpectedScore =
      playerTwoTransELO / (playerTwoTransELO + playerOneTransELO);
    const playerOneUpdatedELO = Math.round(
      playerOneOriginalELO + 32 * (1 - playerOneExpectedScore)
    );
    const playerTwoUpdatedELO = Math.round(
      playerTwoOriginalELO + 32 * (0 - playerTwoExpectedScore)
    );
    playerOne.elo = playerOneUpdatedELO;
    playerTwo.elo = playerTwoUpdatedELO;
  } else {
    playerTwo.matchWins = playerTwo.matchWins + 1;
    playerOne.matchLosses = playerOne.matchLosses + 1;
    const playerOneOriginalELO = playerOne.elo;
    const playerTwoOriginalELO = playerTwo.elo;
    const playerOneTransELO = Math.pow(10, playerOneOriginalELO / 400);
    const playerTwoTransELO = Math.pow(10, playerTwoOriginalELO / 400);
    const playerOneExpectedScore =
      playerOneTransELO / (playerOneTransELO + playerTwoTransELO);
    const playerTwoExpectedScore =
      playerTwoTransELO / (playerTwoTransELO + playerOneTransELO);
    const playerTwoUpdatedELO = Math.round(
      playerTwoOriginalELO + 32 * (1 - playerTwoExpectedScore)
    );
    const playerOneUpdatedELO = Math.round(
      playerOneOriginalELO + 32 * (0 - playerOneExpectedScore)
    );
    playerOne.elo = playerOneUpdatedELO;
    playerTwo.elo = playerTwoUpdatedELO;
  }
};

export default calculateElo;
