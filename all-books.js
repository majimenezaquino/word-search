document.addEventListener("DOMContentLoaded", async function () {
   const container_books = document.getElementById("container_books")

   if(container_books){
    const response = await fetch("https://raw.githubusercontent.com/majimenezaquino/word-search/master/books.json");
    const books = await response.json();
     for(const book of books){
        console.log("books",book.title)
        const article = document.createElement("article")
             article.classList.add('book')
            article.innerHTML =`
        <a href="${book.link}">
          <img
            src="https://raw.githubusercontent.com/majimenezaquino/word-search/master/img/${book.image}"
            alt="${book.title}"
          />
        </a>
       
         <div class="book__info">
         <a href="${book.link}"> <h3>${book.title}:</h3> <p> ${book.sub_title}</p></a>
         </div>
       

            `
        container_books.appendChild(article)
      
     }
   }
  });