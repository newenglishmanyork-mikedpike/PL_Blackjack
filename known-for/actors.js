// Known For — actor deck.
//
// Each actor has exactly four "known for" titles, matching the four shown on
// their IMDb name page. IMDb reshuffles these occasionally, so treat this as a
// snapshot: if a list looks out of date, edit it here.
//
// Format:
//   name:   display name
//   wiki:   (optional) English Wikipedia page title used to fetch the photo;
//           defaults to the name with spaces turned into underscores
//   titles: [title, year, [extra accepted answers...]]
//
// Guessing already ignores case, punctuation, accents, a leading "The", and
// small typos, and accepts the part of a title before a colon (so "Mission
// Impossible" counts for "Mission: Impossible"). Only add aliases for genuinely
// different names, e.g. "Seven" for "Se7en" or "Harry Potter 1".
window.KNOWN_FOR_ACTORS = [
  { name: "Brad Pitt", titles: [
    ["Fight Club", 1999],
    ["Se7en", 1995, ["Seven"]],
    ["Inglourious Basterds", 2009, ["Inglorious Bastards"]],
    ["Once Upon a Time... in Hollywood", 2019, ["Once Upon a Time in Hollywood"]],
  ]},
  { name: "Leonardo DiCaprio", titles: [
    ["Inception", 2010],
    ["The Wolf of Wall Street", 2013],
    ["Titanic", 1997],
    ["The Departed", 2006],
  ]},
  { name: "Tom Hanks", titles: [
    ["Forrest Gump", 1994],
    ["Saving Private Ryan", 1998],
    ["Toy Story", 1995],
    ["The Green Mile", 1999],
  ]},
  { name: "Meryl Streep", titles: [
    ["The Devil Wears Prada", 2006],
    ["Kramer vs. Kramer", 1979, ["Kramer versus Kramer"]],
    ["Sophie's Choice", 1982],
    ["Mamma Mia!", 2008],
  ]},
  { name: "Scarlett Johansson", titles: [
    ["Lost in Translation", 2003],
    ["Her", 2013],
    ["The Avengers", 2012, ["Avengers Assemble"]],
    ["Marriage Story", 2019],
  ]},
  { name: "Morgan Freeman", titles: [
    ["The Shawshank Redemption", 1994, ["Shawshank"]],
    ["Se7en", 1995, ["Seven"]],
    ["Million Dollar Baby", 2004],
    ["The Dark Knight", 2008],
  ]},
  { name: "Tom Cruise", titles: [
    ["Top Gun", 1986],
    ["Top Gun: Maverick", 2022],
    ["Mission: Impossible", 1996],
    ["Jerry Maguire", 1996],
  ]},
  { name: "Jennifer Aniston", titles: [
    ["Friends", 1994],
    ["The Morning Show", 2019],
    ["Horrible Bosses", 2011],
    ["We're the Millers", 2013],
  ]},
  { name: "Bryan Cranston", titles: [
    ["Breaking Bad", 2008],
    ["Malcolm in the Middle", 2000],
    ["Drive", 2011],
    ["Trumbo", 2015],
  ]},
  { name: "Keanu Reeves", titles: [
    ["The Matrix", 1999],
    ["John Wick", 2014],
    ["Speed", 1994],
    ["The Devil's Advocate", 1997],
  ]},
  { name: "Julia Roberts", titles: [
    ["Pretty Woman", 1990],
    ["Erin Brockovich", 2000],
    ["Notting Hill", 1999],
    ["Ocean's Eleven", 2001, ["Oceans 11"]],
  ]},
  { name: "Will Smith", titles: [
    ["Men in Black", 1997],
    ["The Pursuit of Happyness", 2006, ["Pursuit of Happiness"]],
    ["I Am Legend", 2007],
    ["The Fresh Prince of Bel-Air", 1990, ["Fresh Prince"]],
  ]},
  { name: "Robert Downey Jr.", wiki: "Robert_Downey_Jr.", titles: [
    ["Iron Man", 2008],
    ["Oppenheimer", 2023],
    ["Sherlock Holmes", 2009],
    ["Avengers: Endgame", 2019, ["Endgame"]],
  ]},
  { name: "Margot Robbie", titles: [
    ["The Wolf of Wall Street", 2013],
    ["Barbie", 2023],
    ["I, Tonya", 2017],
    ["Suicide Squad", 2016],
  ]},
  { name: "Denzel Washington", titles: [
    ["Training Day", 2001],
    ["Glory", 1989],
    ["Malcolm X", 1992],
    ["Man on Fire", 2004],
  ]},
  { name: "Cillian Murphy", titles: [
    ["Oppenheimer", 2023],
    ["Peaky Blinders", 2013],
    ["28 Days Later", 2002, ["Twenty Eight Days Later"]],
    ["Inception", 2010],
  ]},
  { name: "Emma Stone", titles: [
    ["La La Land", 2016],
    ["Poor Things", 2023],
    ["Easy A", 2010],
    ["The Favourite", 2018, ["The Favorite"]],
  ]},
  { name: "Matt Damon", titles: [
    ["Good Will Hunting", 1997],
    ["The Martian", 2015],
    ["The Bourne Identity", 2002, ["Bourne"]],
    ["Saving Private Ryan", 1998],
  ]},
  { name: "Jennifer Lawrence", titles: [
    ["The Hunger Games", 2012, ["Hunger Games"]],
    ["Silver Linings Playbook", 2012],
    ["X-Men: First Class", 2011],
    ["Don't Look Up", 2021],
  ]},
  { name: "Samuel L. Jackson", wiki: "Samuel_L._Jackson", titles: [
    ["Pulp Fiction", 1994],
    ["Django Unchained", 2012, ["Django"]],
    ["Jackie Brown", 1997],
    ["The Avengers", 2012, ["Avengers Assemble"]],
  ]},
  { name: "Anthony Hopkins", titles: [
    ["The Silence of the Lambs", 1991],
    ["The Father", 2020],
    ["The Remains of the Day", 1993],
    ["Westworld", 2016],
  ]},
  { name: "Sandra Bullock", titles: [
    ["Speed", 1994],
    ["Gravity", 2013],
    ["The Blind Side", 2009],
    ["Miss Congeniality", 2000],
  ]},
  { name: "Ryan Gosling", titles: [
    ["La La Land", 2016],
    ["Drive", 2011],
    ["Blade Runner 2049", 2017],
    ["Barbie", 2023],
  ]},
  { name: "Johnny Depp", titles: [
    ["Pirates of the Caribbean: The Curse of the Black Pearl", 2003, ["Pirates of the Caribbean", "Curse of the Black Pearl"]],
    ["Edward Scissorhands", 1990],
    ["Sweeney Todd: The Demon Barber of Fleet Street", 2007],
    ["Fear and Loathing in Las Vegas", 1998],
  ]},
  { name: "Natalie Portman", titles: [
    ["Black Swan", 2010],
    ["Léon: The Professional", 1994, ["Leon", "The Professional"]],
    ["V for Vendetta", 2005],
    ["Closer", 2004],
  ]},
  { name: "Christian Bale", titles: [
    ["The Dark Knight", 2008],
    ["American Psycho", 2000],
    ["The Prestige", 2006],
    ["The Fighter", 2010],
  ]},
  { name: "Pedro Pascal", titles: [
    ["The Last of Us", 2023],
    ["The Mandalorian", 2019],
    ["Game of Thrones", 2011],
    ["Narcos", 2015],
  ]},
  { name: "Zendaya", titles: [
    ["Euphoria", 2019],
    ["Dune", 2021],
    ["Spider-Man: Homecoming", 2017],
    ["Challengers", 2024],
  ]},
  { name: "Jim Carrey", titles: [
    ["The Truman Show", 1998],
    ["Eternal Sunshine of the Spotless Mind", 2004, ["Eternal Sunshine"]],
    ["Ace Ventura: Pet Detective", 1994],
    ["The Mask", 1994],
  ]},
  { name: "Harrison Ford", titles: [
    ["Star Wars", 1977, ["Star Wars: A New Hope", "A New Hope"]],
    ["Raiders of the Lost Ark", 1981, ["Indiana Jones"]],
    ["Blade Runner", 1982],
    ["The Fugitive", 1993],
  ]},
  { name: "Nicole Kidman", titles: [
    ["Moulin Rouge!", 2001],
    ["The Hours", 2002],
    ["Big Little Lies", 2017],
    ["Eyes Wide Shut", 1999],
  ]},
  { name: "Joaquin Phoenix", titles: [
    ["Joker", 2019],
    ["Gladiator", 2000],
    ["Her", 2013],
    ["Walk the Line", 2005],
  ]},
  { name: "Kate Winslet", titles: [
    ["Titanic", 1997],
    ["Eternal Sunshine of the Spotless Mind", 2004, ["Eternal Sunshine"]],
    ["The Reader", 2008],
    ["Mare of Easttown", 2021],
  ]},
  { name: "Hugh Jackman", titles: [
    ["Logan", 2017],
    ["The Prestige", 2006],
    ["The Greatest Showman", 2017],
    ["X-Men", 2000],
  ]},
  { name: "Steve Carell", titles: [
    ["The Office", 2005],
    ["The 40-Year-Old Virgin", 2005, ["40 Year Old Virgin", "Forty Year Old Virgin"]],
    ["Little Miss Sunshine", 2006],
    ["Foxcatcher", 2014],
  ]},
  { name: "Viola Davis", titles: [
    ["Fences", 2016],
    ["The Help", 2011],
    ["How to Get Away with Murder", 2014],
    ["The Woman King", 2022],
  ]},
  { name: "Al Pacino", titles: [
    ["The Godfather", 1972],
    ["Scarface", 1983],
    ["Heat", 1995],
    ["Scent of a Woman", 1992],
  ]},
  { name: "Robert De Niro", titles: [
    ["Taxi Driver", 1976],
    ["Goodfellas", 1990],
    ["Raging Bull", 1980],
    ["The Godfather Part II", 1974, ["The Godfather Part 2", "Godfather 2"]],
  ]},
  { name: "Florence Pugh", titles: [
    ["Midsommar", 2019],
    ["Little Women", 2019],
    ["Oppenheimer", 2023],
    ["Black Widow", 2021],
  ]},
  { name: "Idris Elba", titles: [
    ["Luther", 2010],
    ["The Wire", 2002],
    ["Beasts of No Nation", 2015],
    ["The Suicide Squad", 2021],
  ]},
  { name: "Daniel Radcliffe", titles: [
    ["Harry Potter and the Sorcerer's Stone", 2001, ["Harry Potter and the Philosopher's Stone", "Philosopher's Stone", "Sorcerer's Stone", "Harry Potter 1"]],
    ["Harry Potter and the Deathly Hallows: Part 2", 2011, ["Deathly Hallows Part 2", "Harry Potter 8"]],
    ["Swiss Army Man", 2016],
    ["Now You See Me 2", 2016],
  ]},
  { name: "Anne Hathaway", titles: [
    ["The Devil Wears Prada", 2006],
    ["Les Misérables", 2012],
    ["Interstellar", 2014],
    ["The Princess Diaries", 2001],
  ]},
  { name: "Jack Nicholson", titles: [
    ["One Flew Over the Cuckoo's Nest", 1975],
    ["The Shining", 1980],
    ["As Good as It Gets", 1997],
    ["The Departed", 2006],
  ]},
  { name: "Timothée Chalamet", titles: [
    ["Dune", 2021],
    ["Call Me by Your Name", 2017],
    ["Wonka", 2023],
    ["Little Women", 2019],
  ]},
  { name: "Bill Murray", titles: [
    ["Groundhog Day", 1993],
    ["Lost in Translation", 2003],
    ["Ghostbusters", 1984],
    ["Caddyshack", 1980],
  ]},
  { name: "Jodie Comer", titles: [
    ["Killing Eve", 2018],
    ["Free Guy", 2021],
    ["The Last Duel", 2021],
    ["The Bikeriders", 2023],
  ]},
  { name: "Charlize Theron", titles: [
    ["Mad Max: Fury Road", 2015, ["Fury Road"]],
    ["Monster", 2003],
    ["Atomic Blonde", 2017],
    ["The Italian Job", 2003],
  ]},
  { name: "Heath Ledger", titles: [
    ["The Dark Knight", 2008],
    ["Brokeback Mountain", 2005],
    ["10 Things I Hate About You", 1999, ["Ten Things I Hate About You"]],
    ["A Knight's Tale", 2001],
  ]},
  { name: "Tom Hardy", titles: [
    ["Mad Max: Fury Road", 2015, ["Fury Road"]],
    ["Inception", 2010],
    ["Peaky Blinders", 2013],
    ["Venom", 2018],
  ]},
  { name: "Jennifer Coolidge", titles: [
    ["The White Lotus", 2021],
    ["Legally Blonde", 2001],
    ["American Pie", 1999],
    ["Best in Show", 2000],
  ]},
];
