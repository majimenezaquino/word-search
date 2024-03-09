document.addEventListener("DOMContentLoaded", async function () {
   const container_books = document.getElementById("container_books")

   if(container_books){
    const response = await fetch("https://wordsearch.onbook.es/books.json");
    const books = await response.json();
     for(const book in books){
        console.log(data)
        const article = document.createElement("article")
            article.innerHTML =`
            <article class="book">
        <a href="${article.link}">
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