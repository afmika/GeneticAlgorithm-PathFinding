const links = [
    {
        text : "Path finding inside a graph", 
        value : "./graph.html"
    },
    {
        text : "Path finding inside a graph + animation", 
        value : "./graph-animated.html"
    },
    {
        text : "Path finding inside a random graph + animation", 
        value : "./random-graph-animated.html"
    },
    {
        text : "Path finding inside a Grid Map", 
        value : "./discrete.html"
    },
    {
        text : "Path finding inside a Grid Map + animation", 
        value : "./discrete-animated.html"
    },
    {
        text : "Animated creatures", 
        value : "./creatures-animated.html"
    }
];

links.forEach(link => {
    document.querySelector("#link_list").innerHTML +=
    `<a href="${link.value}">
        <button class="btn btn-primary btn-lg btn-block" type="button">
            ${link.text}
        </button>
        <br/>
    </a>`;
});