// Expand the blocks on click.
$('.blocks').click( (e) => {
  console.log('top working');
  // Only proceed if the user clicked on a block.
  if($(e.target).hasClass('block')) {
    var menu = $('.menu-left');

    // If the menu is already slid out...
    if(menu.hasClass('slide')) {

      // Menu toggle button.
      $(e.currentTarget).children().toArray().forEach((item, index) => {
        $(item).removeClass('slide')
      });

      // Menu itself.
      menu.removeClass('slide');

      // All block text elements.
      $('.block-text.five').removeClass('slide');
      $('.block-text.four').removeClass('slide');
      $('.block-text.three').removeClass('slide');
      $('.block-text.two').removeClass('slide');
    }

    // If the menu is not already slid out...
    else {

      // Menu toggle button.
      $(e.currentTarget).children().toArray().forEach((item, index) => {
        $(item).addClass('slide') 
      });

      // Menu itself.
      menu.addClass('slide');

      // All block text elements.
      $('.block-text.five').addClass('slide');
      $('.block-text.four').addClass('slide');
      $('.block-text.three').addClass('slide');
      $('.block-text.two').addClass('slide');
    }
  }
});

// Click on a suggested word to put it on the board.
$(document).click( (e) => {

  // Only proceed if the user clicked on a block text container.
  if($(e.target).hasClass('block-text')) {
  console.log('bottom working');
    
    // Store the word from this row of blocks.
    var word = '';
    $(e.target).parent('.block-text-container').children().toArray().forEach( (item, index) => {
      word = $(item).html() + word;
    });

    // Remove all letters currently on the board.
    for(var i = 0; i < 5; i++) {
      removeLetter();
    }

    // Put this word into the current row of the gameboard.
    for(var i = 0; i < word.length; i++) {
      addLetter(word[i]);
    }

  }

});