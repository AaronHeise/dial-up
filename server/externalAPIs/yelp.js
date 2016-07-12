var Yelp = require('yelp');
var env = require('dotenv').config();

var yelp = new Yelp({
  consumer_key: process.env['CONSUMER_KEY'],
  consumer_secret: process.env['CONSUMER_SECRET'],
  token: process.env['TOKEN'],
  token_secret: process.env['TOKEN_SECRET']
});

// var yelpSearch = function(search, location, cb) {
//   yelp.search({term: search, location: location})
//     .then(function(data) {
//       cb(data);
//       console.log(data);
//     })
//     .catch(function(err) {
//       console.error(err);
//     });
//   };

var yelpSearch = function(search, location, limit, cb) {
  yelp.search({term: search, location: location})
    .then(function(data) {
      // Show buisnesses only; not interested in coordinates
      var businesses = data.businesses;
      // Filter out currently closed businesses and those with ratings < 4
      var filteredList = businesses.filter(function(el) {
        return el.rating >= 4 &&
               el.is_closed === false;
      });
      var truncatedList = filteredList.slice(0, limit);
      // Create newArr to store categories we're interested in pulling
      var newArr = [];
      var finalList = truncatedList.map(function(el) {
        // newArr.push({'business': el.name, 'rating': el.rating, 'rating_image': el.rating_img_url_small, 'phone': el.display_phone})
        newArr.push({'business': el.name,
                     'reviews': el.snippet_text,
                     'phone': el.display_phone,
                     'rating': el.rating,
                     'rating_image': el.rating_img_url_small})
      });
      cb(newArr);
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  // // *** UNCOMMENT TO SEE LOG OF QUERY ***
  // yelpSearch("lunch", "san francisco", 10, function(element) {
  //   console.log(element);
  // });

module.exports = {
  yelpSearch: yelpSearch,
  yelpKeys: yelp
}