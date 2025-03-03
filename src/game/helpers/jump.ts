export function calculateJumpMotion(jumpCounter, jumpTime, jumpHeight ) {
  /*
    Math time!!!!

    We should mess around with the jump function until we find whatever
    is the most fun and makes sense. For now I'm going to implement it as a 
    parabola. I think if we implemented a real physics engine this is the same
    shape it would be but right now I'm thinking we avoid doing that

    Ok so in order to have a parabola equation where Y is height and X is time
    and the parabola starts at 0, ends at X jumpTime and peaks at Y jumpHeight,
    we write
    
    y = (jumpHeight/(jumpTime^2)) * (x-jumpTime/2)^2 + jumpHeight

    Take the derivative

    dy/dx = 2 * (jumpHeight/(jumpTime^2)) * (x-jumpTime/2)

    This is how much we add to the player's position on each frame
    
    Once the jump is over, or if the player releases the jump button and
    cancels the jump, the player falls at the natural falling speed

    We want to cap the maximum speed that the player can fall during the jump
    at the natural falling speed, because it would lead to weird behavior otherwise
  */

  //jumpCounter counts down while X should count up
  return 2 * (jumpHeight/(Math.pow(jumpTime,2))) * (jumpCounter-jumpTime)/2;
}
