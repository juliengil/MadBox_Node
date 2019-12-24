# MadBox_Node

### Time spent
 * 3h on the shell script and the docker container
 * 3h30 on the node script
 * times are including the seeking of informations

### Technical/architectural choices
 * I used the request and cheerio modules in order to ease the access and the scraping of the webpage content.
 * I used constants describing the webpage to scrap in order to easily update them in case we'd like to scrap another type of page/content.
 * A *result* object with methods have been created in order to make the code more readable, and to ease the treatment.
 * As you told me you used node just to create short scripts, I did the same here, in a simple form.
 * The whole js is launched inside of a docker container, through a shell script. It allows to run it on any computer, without minding the node version, and also makes it easier to deploy elsewhere.

### The hard parts
 * It was a bit harsh to get the js syntax, and I never had to scrap anything before, but looking online for ideas and guidance made me discover the two modules I used, which eventually made the operation pretty easy.
 * The lack of structure (or the great freedom, depends of the point of view) in javascript makes it easy to produce bad code.
 * I wanted to use a class in javascript but I had a hard time because of a scope problem with the request method which couldn't reach the other methods of the class, I eventually read that the classes were not the same as in java, so I gave up this ideacand used a simple object with methods, which is pretty much what I needed.
 * The more problems I had in node were due to the request method : the scope I mentionned above, but also the async side I didn't know how to handle in a simple way.
 * For the docker container, and since I console.log() the result of the node script, I just print out the docker logs of the container, from the shell script. It pushes me to run a whole new container instead of restart the old one, since the logs aren't erased when the container stops.

### Next steps
 * The script could be turned into an API through an actual node server : it would be always available and could be requested whenever wanted, giving the args defining the page and content to scrap as url parameters.

 OR, if we want to keep it as a script to run everytime

 * It could be made more generic, passing parameters through the shell script and therefore, through the docker command line, to specify the page to scrap and its specificities along with the expected output format.

 OR

 * The current script could be turned into a module in order to use it within other more elaborated scripts