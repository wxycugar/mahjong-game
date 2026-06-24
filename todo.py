todos = []

def add_task():
    task = input("请输入任务内容: ")
    if task:
        todos.append({"content": task, "done": False})
        print(f"已添加: {task}")
    else:
        print("任务内容不能为空")

def list_tasks():
    if not todos:
        print("暂无任务")
        return
    print("\n--- 任务列表 ---")
    for i, t in enumerate(todos, 1):
        status = "[x]" if t["done"] else "[ ]"
        print(f"  {i}. {status} {t['content']}")
    print()

def complete_task():
    list_tasks()
    if not todos:
        return
    try:
        idx = int(input("请输入要完成的任务编号: ")) - 1
        if 0 <= idx < len(todos):
            todos[idx]["done"] = True
            print(f"已完成: {todos[idx]['content']}")
        else:
            print("编号无效")
    except ValueError:
        print("请输入数字")

def delete_task():
    list_tasks()
    if not todos:
        return
    try:
        idx = int(input("请输入要删除的任务编号: ")) - 1
        if 0 <= idx < len(todos):
            removed = todos.pop(idx)
            print(f"已删除: {removed['content']}")
        else:
            print("编号无效")
    except ValueError:
        print("请输入数字")

def main():
    print("=== 待办事项管理 ===")
    while True:
        print("\n1. 添加任务  2. 查看任务  3. 完成任务  4. 删除任务  5. 退出")
        choice = input("请选择操作: ")
        if choice == "1":
            add_task()
        elif choice == "2":
            list_tasks()
        elif choice == "3":
            complete_task()
        elif choice == "4":
            delete_task()
        elif choice == "5":
            print("再见!")
            break
        else:
            print("无效选择")

if __name__ == "__main__":
    main()
