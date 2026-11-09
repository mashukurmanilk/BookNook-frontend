import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://mashukurmanik_booknook:0lr2CpeFzLVvG5Nd@cluster0.jcsvfv3.mongodb.net/BookNook?retryWrites=true&w=majority";

const sampleBooks = [
  {
    title: "The Science of Spice",
    author: "Dr. Stuart Farrimond",
    category: "Science",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
    description:
      "This beautifully illustrated volume explores the chemistry, history, and culinary science of over 60 spices. Organized like a periodic table of spices, it groups them by key flavor compounds to elevate your culinary creations.",
    totalCopies: 5,
    availableCopies: 5,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Curator",
    createdAt: new Date("2026-11-01T08:00:00Z"),
  },
  {
    title: "Still Me: A Novel",
    author: "Jojo Moyes",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    description:
      "Louisa Clark arrives in New York ready for adventures and confident that she can embrace her new life while keeping her relationship with Ambulance Sam alive across thousands of miles.",
    totalCopies: 4,
    availableCopies: 4,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Curator",
    createdAt: new Date("2026-11-02T09:30:00Z"),
  },
  {
    title: "The Boyfriend: A Riveting Psychological Thriller",
    author: "Freida McFadden",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop",
    description:
      "Sydney Shaw thinks she has finally met the man of her dreams in a charming doctor. But when a brutal killer begins terrorizing the city, she starts wondering who he truly is.",
    totalCopies: 3,
    availableCopies: 3,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Curator",
    createdAt: new Date("2026-11-03T10:15:00Z"),
  },
  {
    title: "Facebook: The Inside Story",
    author: "Steven Levy",
    category: "Science",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    description:
      "The definitive history of the company that transformed human connection and society, based on unprecedented three years of access to Mark Zuckerberg and Sheryl Sandberg.",
    totalCopies: 4,
    availableCopies: 4,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Curator",
    createdAt: new Date("2026-11-04T11:00:00Z"),
  },
  {
    title: "Throne of Nightmares",
    author: "Kerri Maniscalco",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3dd45?q=80&w=800&auto=format&fit=crop",
    description:
      "A thrilling fantasy filled with intoxicating magic, deadly court intrigue, and romantic suspense set within the shadows of an ancient mystical realm.",
    totalCopies: 4,
    availableCopies: 4,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Curator",
    createdAt: new Date("2026-11-05T14:20:00Z"),
  },
  {
    title: "Where the Wild Things Are",
    author: "Maurice Sendak",
    category: "Kids",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
    description:
      "Max sails away to a mythical island where the Wild Things roam, teaching generations of children about imagination, emotions, and the comforting feeling of home.",
    totalCopies: 6,
    availableCopies: 6,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Curator",
    createdAt: new Date("2026-11-06T15:00:00Z"),
  },
  {
    title: "A Short History of Nearly Everything",
    author: "Bill Bryson",
    category: "History",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop",
    description:
      "A brilliantly entertaining journey through time and science, illuminating how we went from there being nothing at all to there being humankind.",
    totalCopies: 4,
    availableCopies: 4,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Curator",
    createdAt: new Date("2026-11-07T16:45:00Z"),
  },
];

export async function GET() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("BookNook");
    const booksCollection = db.collection("books");

    const count = await booksCollection.countDocuments();
    if (count === 0) {
      await booksCollection.insertMany(sampleBooks);
      await client.close();
      return NextResponse.json({
        success: true,
        message: `Successfully seeded ${sampleBooks.length} initial books into the library database.`,
        count: sampleBooks.length,
      });
    }

    await client.close();
    return NextResponse.json({
      success: true,
      message: "Database already contains books. No seed action necessary.",
      count,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
