// Expand the blocks on click.
$('.blocks').click( (e) => {
  // Only proceed if the user clicked on a block.
  if($(e.target).hasClass('block')) {
    var menu = $('.menu-left');
    $(e.currentTarget).children().toArray().forEach( 
      (item, index) => {
        if($(item).hasClass('slide')) {
          $(item).removeClass('slide');
          menu.removeClass('slide');
          $('.block-text.five').removeClass('slide');
          $('.block-text.four').removeClass('slide');
          $('.block-text.three').removeClass('slide');
          $('.block-text.two').removeClass('slide');
        }
        else {
          $(item).addClass('slide');
          menu.addClass('slide');
          $('.block-text.five').addClass('slide');
          $('.block-text.four').addClass('slide');
          $('.block-text.three').addClass('slide');
          $('.block-text.two').addClass('slide');
        }
    });
  }
});