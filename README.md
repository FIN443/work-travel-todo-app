# WorkTravelToDoApp

Work 또는 Travel, 해야할 것 기록하는 앱

## 구현할 것

- [x] 앱 재실행시, 마지막 상태가 Work 였는지 Travel 였는지 확인하고 그 상태에서 시작
- [x] Done 기능 추가(Done이면 아래로 정렬)

```javascript
예시)
Object {
  [Date.now()]: {
    text: "Text",
    working: true,
    isDone: false,
    isEditing: false,
    created: Date.now(),
    updated: Date.now(),
  },
  ...
}
```

- [x] Edit 기능 추가(Edit 누르면 Text부분 Input으로 보이고, 최근 기록으로 저장)
- [ ] 정렬 기능(최신, 오래된)
- [ ] 라이트/다크 모드
- [ ] Code Refactoring
- [ ] Styling
