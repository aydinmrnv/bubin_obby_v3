function updateGame() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw smiley (player)
  drawCircle(smiley.x, smiley.y, smiley.radius, invincible ? "lightgreen" : "green");

  // Draw carrots
  carrots.forEach((carrot, index) => {
    drawCircle(carrot.x, carrot.y, carrot.radius, "orange");

    if (isCollision(smiley.x, smiley.y, smiley.radius, carrot.x, carrot.y, carrot.radius)) {
      carrots.splice(index, 1);
      score++;

      // Spawn a new enemy for every 10 points
      if (score % 10 === 0) {
        spawnNewMonster();
        if (score % 10 === 0) {
          spawnPowerUp(); // Spawn power-up every 10 carrots
        }
      }
    }
  });

  // Check if all carrots are collected
  if (carrots.length === 0) {
    generateCarrots(initialCarrotCount);
  }

  // Draw poops
  poops.forEach((poop, index) => {
    drawCircle(poop.x, poop.y, poop.radius, "brown");

    if (isCollision(smiley.x, smiley.y, smiley.radius, poop.x, poop.y, poop.radius)) {
      poops.splice(index, 1);
      score -= 5; // Subtract 5 points when hitting a poop
    }
  });

  // Draw power-ups and check for collision with the player
  powerUps.forEach((powerUp, index) => {
    drawPowerUp(powerUp.x, powerUp.y, powerUp.radius);

    if (isCollision(smiley.x, smiley.y, smiley.radius, powerUp.x, powerUp.y, powerUp.radius)) {
      powerUps.splice(index, 1);
      invincible = true; // Activate invincibility
      invincibleTimer = 300; // Set timer for 5 seconds (300 frames at 60fps)
    }
  });

  // Draw enemies and move them
  enemies.forEach((enemy, index) => {
    flashTimer++;
    drawEnemy(enemy.x, enemy.y, enemy.radius, invincible); // Pass flashing effect during invincibility
    moveEnemy(enemy);
    dropPoopFromMonster(enemy);

    // Check if collision with enemy occurs and handle invincibility
    if (isCollision(smiley.x, smiley.y, smiley.radius, enemy.x, enemy.y, enemy.radius)) {
      if (invincible) {
        // Kill only one monster at a time during invincibility
        enemies.splice(index, 1); // Destroy monster
        score += 5; // Gain 5 points
        spawnNewMonster(); // Spawn a new monster
        return; // Exit the loop to avoid processing further collisions this frame
      } else {
        deathSound.play();
        stopMusic();  // Stop the background music
        gameRunning = false;
        alert("Game Over! Your score: " + score);
        location.reload();
      }
    }
  });

  // Display score
  displayScore();

  // Update invincibility timer
  if (invincible) {
    invincibleTimer--;
    if (invincibleTimer <= 0) {
      invincible = false; // Deactivate invincibility
    }
  }

  requestAnimationFrame(updateGame);
}

