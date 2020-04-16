---
date: 2020-03-09
title: How to Teach Programming (and other things)
template: post
thumbnail: "../thumbnails/writing.png"
slug: how-to-teach-programming-the-importance-of-mental-models
categories:
  - Education
tags:
  - education
---

### _TL;DR: How to teach programming and other things_

Teachers should

- Provide direct instruction to explain the basics of programming.
- Teach students problem-solving "chunks / patterns". Teaching problem-solving "chunks" is more effective, to learn problem-solving skills, than having students work through problems.
- Students should read code out loud to help form correct programming mental models.
- Practice a lot
-

I came across an amazing talk by <a href="https://www.felienne.com/" target='_blank'>Felienne Hermans</a>, an associate professor who heads the Programming Education Research Lab at the Leiden University Institute of Advanced Computer Science.

In the talk, she speaks on "How to teach programming (and other things)", and her take away lessons on teaching programming to children.

I'm really interested in the education space, so here are the take away main points that I appreciated -

<iframe width="560" height="315" src="https://www.youtube.com/embed/g1ib43q3uXQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 👨🏻‍🏫 A common approach to teaching programming: Exploration and Experimentation

It turns out, most programmers teach programming using the same approach they, themselves, learned programming:

**Exploration and experimentation.**

Especially for programmers who were born in the 80's (aka, the current generation of middle aged professionals), their first introduction to programming was usually in their childhood through a programming book (there was no YouTube at this time). These books usually contain source code of example programs that you had to manually type into a computer.

This process of learning is usually completely self directed with no outside instruction. It's a process of reading, and copying code examples - and of course debugging any syntax errors caused by typos.

_(This also describes my first experience learning programming. I remember picking up programming when I was in middle school, coding along to "Sams Teach Yourself C++ in 24 Hours" which I picked up from the library)._

So now when it comes to teaching other children how to program, we'll instinctively default to repeating a process that has past empirical evidence of success.

Since many programmers first experienced learning programming through this self exploration and experimentation approach, it's no surprise that this same approach that is commonly used to teach programming:

> **"I know how to program, and I learned programming through exploration. So this is probably how programming should be taught."**

_(In fact, when I did take my AP programming classes in high school, my teachers did structure the class with an emphasis on self exploration, and with minimal prior explanation and instruction on how to approach problem-solving)._

## 👨🏻‍🏫 A common approach to teaching programming: Teach problem-solving by having students solve problems

One of the central goals that most programming education attempts to teach students is, how to become problem solvers. Programming, after all, does require strong problem-solving skills.

The common belief is:

> **"I want students to learn to become problem solvers, so they should solve problems."**
>
> **"If I show students how to solve the problem before they try the problem themselves, they lose the learning opportunity."**

Again, these beliefs lead many teachers to approach teaching programming through a primarily self exploration environment.

This education environment places the onus the student to improve their problem-solving skills through the practice of solving programming problems.

## 📝 The constructionist view: A quick history on the Exploration and Experimentation approach to teaching

A figurehead in the history of programming education is, <a href="https://en.wikipedia.org/wiki/Seymour_Papert" target='\_blank'>Seymore Papert</a>. Papert created, LOGO, one of the first programming languages for teaching programming to children. Later on, he also collaborated with LEGO to create the MINDSTORMS blocks, a line of LEGO bricks that are embedded with programmable computers.

Papert is known for the constructionist movement in education and spent most of his career teaching and researching at MIT.

Papert's constructionist view believes that children learn best through tinkering and unstructured activities that resemble play, and solving problems that are interesting to them, much as they do in nonschool situations.

In fact, by explaining the solution to a problem, you take away the opportunity for a child to discover it.

Being that Papert had such a foundational role in programming education for children, this constructionist view is ingrained in approach of many programming education programs:

> **Don't explain problem solutions up front; Let kids explore and discover the solutions by themselves.**

## 🙋🏻‍♂️ Children don't become an experts by doing expert things

Let's revisit this approach to teaching programming:

> **"I want students to learn to become problem solvers, so they should solve problems."**
>
> **"If I show students how to solve the problem before they try the problem themselves, they lose the learning opportunity."**

The following are somewhat contrived examples, but consider applying the same problem-solving and constructivist approach to other situations of skills based learning:

### Tennis:

**"I want students to learn to become tennis players, so they should play tennis matches."**

**"Here's a tennis racquet and a ball. I won't tell you how it works, but I want you to become an expert tennis player."**

### Guitar:

**"I want students to learn to become guitar players, so they should play guitar performances.**

**"Here's a guitar. I won't tell you how it works, but I want you to become an expert guitar player."**

## 💡 Students learn through deliberate explanation and skills based practice

In fact, when we want to teach children to become experts in situations of skills based learning we employ practice. More specifically, we use deliberate practice of broken-down skills.

In these cases, the sum of the parts is greater than the whole.

To become an expert guitar player, we don't have students play concerts every day. Children should practice scales, chords, and strumming patterns.

To become an expert tennis player, we don't have students play lots of tennis matches. Chidren should practice drills and racquet technique.

> Outside of the context of teaching problem-solving, it's clearly understood that skills improvement is based on:
>
> **Deliberate explanation and deliberate practice.**

## 💡 Students learn problem-solving skills through acquiring problem solving "chunks"

In 2006, a study was done to measure the effectiveness of the constructivist approach of education for problem-based teaching, <a href='http://mrbartonmaths.com/resourcesnew/8.%20Research/Explicit%20Instruction/Why%20minimal%20guidance%20instruction%20does%20not%20work.pdf' target='_blank'>"Why Minimal Guidance During Instruction Does Not Work" - An Analysis of the Failure of Constructivist, Discovery, Problem-Based, Experiential, and Inquiry-Based Teaching</a>.

> **Contrary to the constructivist view, the study found that providing worked examples of problem sets was a superior substitute for exploratory problem-solving in learning algebra.**

In the study, two groups of students were presented with the algebra problem:

```
Given:
  a = 7 - 4a

Question:
  Solve for a
```

**Group 1:**

Students in Group 1 were just given the problem to solve. This would follow the constructivist approach to learning.

**Group 2:**

Students in Group 2 were first given a step-by-step example and explanation for solving algebra problems of this specific pattern.

```
a = b - ca
```

```
a = b - ca
a + ca = b
a(a + c) = b

a = b / (1 + c)
```

After studying the solution pattern, students in Group 2 then were given the problem to solve.

### Performance results between Group 1 and Group 2

Not surprisingly, students in Group 2 solved the problem faster. Moreover, the students in Group 2 solved it significantly faster, in just 1/5th of the time that it took students in Group 1.

The common argument from teachers against students in Group 2 is usually:

**"Well, of course the students in Group 2 performed better - they received the answer solution before they started!"**

However, what is interesting is that when both groups of students were then given new different algebra problems, the students in Group 2 also solved these problems faster too.

## ⏳ Cognitive load reduces our brain's limited working / short-term memory

Our limited working / short-term memory can only store about 2-6 items, which can quickly be filled up when we approach novel problem-solving tasks.

For an example, try to memorize this first set of characters:

```
\*&     &@)\_     1@07
```

Now try to memorize this second set of characters, which contain the same number of characters per group:

```
cat     loves     cake
```

You could tangibly feel the increased cognitive load of trying to memorize the first set of characters. It felt like the characters didn't fit in the brain and our working memory getting overloaded.

However, instead of saving the individual characters, `cat loves cake` - we have learned to "chunk" the letters and store whole words.

Similarly, we can apply learned "chunking" to increase the capacity and effectiveness of of working memory.

## 💡 Teach programming by equipping students with problem-solving "chunks" to reduce cognitive load

The study more interestingly demonstrated the negative effect of cognitive load on our working memory.

Our brains have limited working / short-term memory and when we engage in intensive and novel problem-solving tasks, our brains are taxed with cognitive load.

Contrary to the constructivist view, merely presenting students with novel problem-solving situations without prior problem solving "chunks" expended the majority of the student's available working memory.

This reduced the ability for the students to absorb additional learning skills from solving the problem sets.

> **When students were provided with a problem-solving "chunk", they experienced a lower cognitive load. This allows students to reflect, review and learn from the problem set they had just completed.**

These students could apply their learning from previous problem sets on new different problems.

Circling back to how to teach programming, we should be equipping students with the problem-solving "chunks" that they can apply to programming problems.

### "If I want students to learn to become problem solvers, I should equip them with problem solving patterns."

## 💡 Forming correct mental models

How something sounds affects how you interpret the meaning
Chunking becomes Mental Models

there is a set of deep-rooted analogies that you associated with it.
These approximations of how something works in your head are known as “mental models”

Some analogies come from the real world. Other analogies may be repurposed from other academic fields you learned first, like numbers from math
These intuitions (like “boxiness” of variables) influence how we read code

Some analogies might overlap and even contradict each other, but they still help you make sense of what’s happening in the code

```
let a = 10;
let b = a;
a = 0;
```

What are the values of variable `a` and variable `b` after it runs?

```
let a = 10;
```

Declare a variable called a. Set the variable a to the value 10.

```
let b = a;
```

Declare a variable called b.
Set the variable b to the value stored in a.
What is variable a set to again? The variable a is set to the value 10.
So set variable b to the value 10.

```
a = 0;
```

Set the variable a to the value 0.
So now, the variable a is 0, and the variable b is 10.

## 💡 Reading code aloud improves comprehension of code

The Case for Case Studies of Programming Problems

https://www.researchgate.net/publication/220425310_The_Case_for_Case_Studies_of_Programming_Problems

3 groups presented with a programming problem

Group 1: Wrote their own code to the programming problem, and then given the solution.
Group 2: Wrote their own code to the programming problem, and were provided the solution written by an expert, in addition to an explanation on why the problems were solved in that approach.
Group 3: Didn't write any code at all during the whole class. They only read and studied the solutions written by an expert, in addition to an explanation on why the problems were solved in that approach.

Most teachers prefer the approach of Group 1.
Their belief is that students need to learn how to solve problems on their own.

Group 2 and Group 3 performed equally as well on tests after studying in their respective approaches.

From this case study, it doesn't matter if you have students write any code, if the students can study expert code and are provided with the explanations on the solutiolns.

Reading code solutions with an explanation doesn't require a heavy cognitive load.
Lots of cognitive load left to store problem-solving chunks.

"If I have to reverse an array, I can remember these steps to solve that problem"
Explicitly teaching strategies and patterns for solving coding problems.

Assessment
Goal is not for gauge academic ranking, but to allow teachers to gain insight on which concepts are grasped and memorized.

Asking children to remember something, helps them to remember it for the next week.

At the end of each code club
Which of these code snippets declares a variable?
Which of these code snippets sets a variable to 0?

## A Note on Learning Motivation: Motivating learning through fun vs the intrinsic motivation of learning

Better approach: The way to learn programming is by building fun things.
The kids were getting frustrated: "this is really hard"

Usually programming education approaches teaching with the following concepts:

- Programming is hard,
- So the most important thing about learning programming is to have fun.
- The way to learn programming is by finding mistakes and learning from mistakes.

You can see these ideas in the pedagogical approach that interactive educational games that teaching programming, like <a href="https://www.playosmo.com/en/coding/">Osmo's, Coding Awbie</a>.

_Coding Awbie teaches logic skills and problem-solving, and it helps kids succeed in an increasingly digital world. Coding Awbie is the easiest way to introduce coding to your child._

The focus is to teach problem-solving and coding in an entertaining and 'fun' way. During the first weeks the game was really engaging, and I thought that this was a great way to get children interested in programming.

However, I asked a few weeks later how he was progressing in his game and found out that he had lost the interest in the game.

This is the shortcoming of using 'fun' as the motivation to learning programming. Programming quickly becomes hard (and maybe even boring when you're trying to debug mundane syntax errors). And if child is told that learning programming is fun, it's easy for the child to lose interest when the learning process is no longer fun.

<!-- I watched my nephew play Coding Awbie. There was no actual instruction and explanation. The focus was to allow the child to explore and discover the solution to the game through arranging the different physical puzzle-piece coding blocks. -->

Teachers shouldn't convey that learning programming is fun.
Learning isn't necessarily fun.
Learning is hard work.
Teachers usually think that motivation leads to skill acquisition.

If children are learning and acquiring skill, that is motivation.
Show children that they are learning, that that will bring the motivation. Not the other way around.
