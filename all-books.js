document.addEventListener("DOMContentLoaded", async function () {
   const container_books = document.getElementById("container_books")

   if(container_books){
    const response = await fetch("https://wordsearch.onbook.es/books.json");
    const data = await response.json();
     if(data){

        console.log(data)
     }
   }
  });