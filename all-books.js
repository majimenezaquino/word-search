document.addEventListener("DOMContentLoaded", async function () {
   const container_books = document.getElementById("container_books")

   if(container_books){
    const response = await fetch("https://raw.githubusercontent.com/majimenezaquino/word-search/master/books.json");
    const books = await response.json();
     for(const book in books){
        console.log(data)
        const article = document.createElement("article")
            article.innerHTML =`
            <article class="book">
        <a href="https://raw.githubusercontent.com/majimenezaquino/word-search/master/img/${article.link}">
          <img
            src="${article.image}"
            alt="${article.title}"
          />
        </a>
        <h3>
          <a href="${article.link}"
            >${article.title}: ${article.sub_title}</a
          >
        </h3>
      </article>

            `
        container_books.appendChild(article)
      
     }
   }
  });