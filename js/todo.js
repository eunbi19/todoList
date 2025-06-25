//오늘 날짜
const week = ["일", "월", "화", "수", "목", "금", "토"];
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();
let day = today.getDay();
let popupDay = week[day];

const todayText = document.querySelector(".date-box .txt");

const todayWeek = document.querySelector(".date-box span");

//헤더 날짜
todayText.innerHTML = `${year}년 ${month}월 ${date}일<span>${popupDay}요일</span>`;
todayWeek.textContent = `${week[day]}요일`;

//팝업 날짜
const popupDate = `${year}.${String(month).padStart(2, "0")}.${String(
  date
).padStart(2, "0")}(${popupDay})`;
const inputDate = document.getElementById("date");
if (inputDate) {
  inputDate.value = popupDate;
}

const addBtn = document.getElementById("add-btn");
const closeBtn = document.getElementById("close-btn");
const saveBtn = document.getElementById("save-btn");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const todoPop = document.getElementById("list-add-popup");
const list = document.querySelector(".my_list");
const template = document.getElementById("template");

function Onchksave(checkbox) {
  const li = checkbox.closest("li");
  if (checkbox.checked) {
    li.classList.add("on"); //체크 시 on 클래스 추가
  } else {
    li.classList.remove("on"); //체크 해제 시 on 클래스 제거
  }

  localStorage.setItem(checkbox.id, checkbox.checked);
}

let schList = JSON.parse(localStorage.getItem("mySchedules")) || [];
function Listitem(title, content, id) {
  const clone = template.cloneNode(true);
  clone.removeAttribute("id");
  clone.style.display = "flex";
  clone.querySelector(".text1").textContent = title;
  clone.querySelector(".text2").textContent = content;

  const checkbox = clone.querySelector('input[type="checkbox"]');
  const label = clone.querySelector("label");

  const chkid = `chk-${id}`;
  checkbox.id = chkid;
  checkbox.name = chkid;
  label.setAttribute("for", chkid);

  const saved = localStorage.getItem(chkid);
  checkbox.checked = saved === "true";

  Onchksave(checkbox);
  checkbox.addEventListener("change", () => {
    Onchksave(checkbox);
  });

  // 삭제 버튼
  const removeBtn = clone.querySelector(".remove-btn");
  removeBtn.addEventListener("click", () => {
    schList = schList.filter((item) => item.id !== id);
    localStorage.setItem("mySchedules", JSON.stringify(schList));

    localStorage.removeItem(checkbox.id);
    renderList();
  });

  return clone;
}
function renderList() {
  const noResult = document.querySelector(".no-result");
  list.querySelectorAll("li:not(#template)").forEach((li) => li.remove());
  //리스트 추가
  schList.forEach((item) => {
    const li = Listitem(item.title, item.content, item.id);
    list.appendChild(li);
  });
  // 리스트가 비어있을 때
  if (schList.length === 0) {
    noResult.style.display = "block";
  } else {
    noResult.style.display = "none";
  }
}

saveBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = descriptionInput.value.trim();
  if (title || content) {
    const newList = {
      id: Date.now(),
      title,
      content,
    };
    schList.push(newList);
    localStorage.setItem("mySchedules", JSON.stringify(schList));
    renderList();
  }

  titleInput.value = "";
  descriptionInput.value = "";
  todoPop.style.display = "none";
});
// 팝업 열기 및 닫기
addBtn.addEventListener("click", () => {
  todoPop.style.display = "block";
});
closeBtn.addEventListener("click", () => {
  todoPop.style.display = "none";
});

window.addEventListener("DOMContentLoaded", renderList);
