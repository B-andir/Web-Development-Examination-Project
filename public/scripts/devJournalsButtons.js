function showArticle(articleId) {
    document.getElementById(articleId).classList.toggle("Hidden");

    document.getElementById("BackButton").classList.toggle("Hidden");

    document.getElementById("DevJournalButtons").classList.toggle("Hidden");
    document.getElementById("DevJournalsFull").classList.toggle("Hidden");
}