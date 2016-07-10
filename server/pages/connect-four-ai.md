title: Connect Four Artificial Intelligence
date_clean: July 7th 2016
date: 2016-07-07
tags: [games, python, artificial intelligence]
styles: [connect_four.css]
scripts: [connect_four.js]

To keep you motivated as you read this post, I'll let you know now that you get to play a game after you finish.

The push to advance the state artificial intelligence in leisurely games most likely began when single children grew sick of playing solitaire. Probably because that game is fucking impossible (technically over 20% of solitaire games are unbeatable, however a player can expect to win at least [43% of the time](http://www.jupiterscientific.org/sciinfo/KlondikeSolitaireReport.html)). The first machine ever to give the illusion of competitive sentience came in 1770, with the creation of a chess-playing automaton called [the Turk](https://en.wikipedia.org/wiki/The_Turk). A nearly unstoppable creation - the Turk managed to take down opponents such as Benjamin Franklin, Catherine the Great, and Napoleon. Of course, the Turk turned out to be a hoax, when it was revealed that  the CPU inside of the machine was just a little Hungarian man trying to impress the Empress. It wasn't until over 200 years later, with the creation of IBM's [Deep Blue](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)), that a computer finally beat a reigning world champion in both a game and match of chess.

Instead of chess, this article focuses on the implementation of a common game-play search algorithm in the game [Connect Four](https://en.wikipedia.org/wiki/Connect_Four). And knowing that I can't hide inside of your computer and play connect four against you, I had no other choice than to write a program that can play the game efficiently itself.

Assuming you had a childhood, you're probably familiar with Connect Four (or if you were one of Captain Cook's shipmates you may know it as [Captain's Mistress](http://www.tradgames.org.uk/games/Four-in-a-row.htm)). But to be safe, here's a quick overview:

1. Two players take turns dropping a disc into a 6x7 slot game board (classic game dimensions)
2. The discs stack vertically from the lowest available row
3. The game ends when either a player has aligned four of their discs in a row (horizontally, vertically, or diagonally) or when there are no more available slots

A game of Connect Four has [perfect information](https://en.wikipedia.org/wiki/Perfect_information), meaning at all times each player is completely aware of every move that has occurred thus far, as well as all moves that can further take place. This makes it a great , which I will discuss more about soon. The first player can _always_ force a win by placing their first tile in the middle (columns 3, 4, or 5), however the second player can force a win if the first player places their tile in an outer column (1, 2, 6, or 7).

Minimax section. If you've ever worked with game theory with relation to artificial intelligence, I'm sure you saw.

Monte Carlo tree search overview.

Javascript bot class.

<pre class="get-away"><code class="language-python">import connect_four

class Bot():
    def __init__(self):
        ...

    def simulate_turn(self):
        ...
</code></pre>


To avoid having my ass sued by Hasbro for copy write infringement, the name of the game you are about to play is called Cohere Four and it uses blue and orange pieces as oppose to the classic red and yellow.

<h4 class="markdown-center">Play Cohere Four</h4>
<canvas id="board"></canvas>

#### References, Inspirations and Further Reading
1. [The Grandmaster Hoax](http://www.theparisreview.org/blog/2012/03/28/the-grandmaster-hoax/)
1. [Connect Four Starter Code](https://codepen.io/coderontheroad/pen/GdxEo)
2. [Searching for Solutions in Games and Artificial Intelligence](http://www.aiexp.info/files/allis-thesis.pdf)
3. [Minimax Connect Four Python Implementation](https://github.com/erikackermann/Connect-Four)
4. [Some Random Cornell Course Assignment that has an illustrated Minimax Tree](http://www.cs.cornell.edu/courses/CS2110/2014sp/assignments/a4/A4ConnectFour.pdf)
5. [Battle Connect Four Bots](http://theaigames.com/competitions/four-in-a-row)