(function() {
  U.openSave=function() {
    var m=document.createElement('div');m.className='modal';m.setAttribute('role','dialog');m.setAttribute('aria-label','저장 이동과 복구');
    m.innerHTML='<div class="sheet"><h2>저장 이동·복구</h2><p class="save-status"></p><button class="export-save">파일 내보내기</button><label>파일 가져오기 <input class="import-save" type="file" accept="application/json,.json"></label><button class="recover-save">복구 사본 미리보기</button><div class="save-preview" aria-live="polite"></div><button class="sheet-close">닫기</button></div>';
    document.body.appendChild(m);var status=m.querySelector('.save-status'),preview=m.querySelector('.save-preview');
    status.textContent=E.saveStatus.error||('마지막 저장: '+(E.saveStatus.time||'아직 저장 없음'));
    m.querySelector('.sheet-close').onclick=function(){m.remove();};
    function show(raw) {
      preview.replaceChildren();
      try {
        var data=E.previewImport(raw),p=document.createElement('p');
        p.textContent=(data.career?data.career.이름+' · '+data.career.나이+'세 · '+data.career.시기:'경력 없음')+' / 도감 '+(data.collection?data.collection.인생수||0:0)+'회 / 2세 보너스 '+(data.bonus?'있음':'없음')+'. 현재 경력·도감·보너스를 모두 덮어씁니다.';
        preview.appendChild(p);var apply=document.createElement('button');apply.textContent='확인 · 현재 저장 덮어쓰기';preview.appendChild(apply);
        apply.onclick=function(){try { E.importSave(raw);m.remove();U.closeModals();if(E.state())U.showGame();else U.showSetup(); }catch(e){status.textContent=e.message;}};
        var cancel=document.createElement('button');cancel.textContent='취소 · 기존 저장 유지';cancel.onclick=function(){preview.replaceChildren();};preview.appendChild(cancel);
      }catch(e){status.textContent=e.message;}
    }
    m.querySelector('.import-save').onchange=async function(e){var file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){status.textContent='2MB 이하 파일만 가져올 수 있습니다.';return;}show(await file.text());};
    m.querySelector('.recover-save').onclick=function(){var raw=E.recoverySave();if(raw)show(raw);else status.textContent='복구 사본이 없습니다.';};
    m.querySelector('.export-save').onclick=function(){try{var url=URL.createObjectURL(new Blob([E.exportSave()],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='football-life-save.json';a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);}catch(e){status.textContent=e.message;}};
  };
})();
