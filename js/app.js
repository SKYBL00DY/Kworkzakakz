// Функция для форматирования даты
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Функция для создания разметки изображений
function createImagesHTML(images) {
  if (!images || images.length === 0) {
    return '<div class="no-image">Изображения отсутствуют</div>';
  }

  const count = images.length;
  let gridClass = "";

  if (count === 1) {
    gridClass = "single-image";
  } else if (count === 2) {
    gridClass = "two-images";
  } else if (count === 3) {
    gridClass = "three-images";
  } else if (count === 4) {
    gridClass = "four-images";
  } else if (count === 5) {
    gridClass = "five-images";
  }

  let imagesHTML = `<div class="images-grid ${gridClass}">`;

  images.forEach((image, index) => {
    imagesHTML += `<img src="${image}" loading="lazy" alt="Изображение ${
      index + 1
    } для статьи">`;
  });

  imagesHTML += "</div>";

  return imagesHTML;
}

// Функция для создания HTML карточки статьи
function createArticleCard(article) {
  return `
        <div class="article-card" data-id="${article.id}">
            <div class="article-header">
                <h2 class="article-title">${article.title}</h2>
                <div class="article-meta">
                    <span class="article-author">${article.author}</span>
                    <span class="article-date">${formatDate(
                      article.date
                    )}</span>
                </div>
            </div>
            
            <div class="article-content">
                <div class="article-description description-short" id="desc-${
                  article.id
                }">
                    ${article.description}
                </div>
                
                <button class="show-more-btn" data-id="${
                  article.id
                }">Visa mer</button>
                
                <div class="article-images">
                    ${createImagesHTML(article.images)}
                </div>
                
                <div class="article-tags">
                    ${article.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")}
                </div>
            </div>
        </div>
    `;
}

// Функция для обработки клика по кнопке "показать еще"
function handleShowMoreClick(articleId) {
  const descElement = document.getElementById(`desc-${articleId}`);
  const button = document.querySelector(
    `.show-more-btn[data-id="${articleId}"]`
  );

  if (descElement.classList.contains("description-short")) {
    // Показываем полный текст
    descElement.classList.remove("description-short");
    button.textContent = "Скрыть";
  } else {
    // Скрываем текст обратно
    descElement.classList.add("description-short");
    button.textContent = "Visa mer";
  }
}

// Функция для отображения всех статей
function renderAllArticles(articlesData) {
  const container = document.getElementById("articlesContainer");
  container.innerHTML = "";

  articlesData.articles.forEach((article) => {
    container.innerHTML += createArticleCard(article);
  });

  // Добавляем обработчики событий для кнопок "показать еще"
  document.querySelectorAll(".show-more-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const articleId = this.getAttribute("data-id");
      handleShowMoreClick(articleId);
    });
  });
}

// Функция для загрузки данных из JSON файла
async function loadArticlesData() {
  try {
    const response = await fetch("articles.json");

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки: ${response.status} ${response.statusText}`
      );
    }

    const articlesData = await response.json();
    return articlesData;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);

    // Показываем сообщение об ошибке
    const container = document.getElementById("articlesContainer");
    container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ff4444;">
                <h3>Ошибка загрузки данных</h3>
                <p>${error.message}</p>
                <p>Проверьте наличие файла articles.json в папке с проектом.</p>
            </div>
        `;

    return null;
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
  const articlesData = await loadArticlesData();

  if (articlesData) {
    renderAllArticles(articlesData);
  }
});

document.querySelectorAll(".question").forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling; // Получаем следующий элемент (ответ)
    if (answer.style.display === "block") {
      answer.style.display = "none"; // Скрываем ответ, если он открыт
      question.classList.remove("active"); // Убираем класс активности
    } else {
      answer.style.display = "block"; // Показываем ответ
      question.classList.add("active"); // Добавляем класс активности
    }
  });
});
