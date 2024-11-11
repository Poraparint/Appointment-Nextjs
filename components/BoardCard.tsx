// components/BoardCard.tsx
import Link from "next/link";

const BoardCard = ({ board }: { board: any }) => {
  return (
    <div key={board.id} className=" bg-pain rounded-md border text-bg hover:bg-purple-900 duration-150">
      <Link href={`/board/${board.id}`}>
        <div className="p-5 rounded-md flex gap-5 items-center">
          <i className="fa-regular fa-calendar"></i>
          {board.board_name}
        </div>
      </Link>
    </div>
  );
};

export default BoardCard;
