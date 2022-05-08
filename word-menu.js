// Expand the blocks on click.
$('.blocks').click( (e) => {
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