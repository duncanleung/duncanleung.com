---
date: 2020-04-30
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

_Teachers should:_

- [_Focus on providing direct instruction to explain programming concepts, over 'self-discovery'._](#-students-learn-through-deliberate-explanation-and-skills-based-practice)
- [_Approach teaching problem-solving skills through teaching problem-solving "chunks / patterns". Students equipped with problem-solving "chunks" have reduced cognitive load during test-taking, allowing students to reflect and acquire new problem-solving skills even on different new problems._](#-cognitive-load-reduces-our-limited-working-memory)
- [_Instruct students to read code out loud. The verbal processing of syntax helps to form correct programming mental models (or reveals incorrect mental models)._](#-the-importance-of-correct-mental-models)
- [_Motivate children to learn by guiding them to build interesting things with the programming skills they're learning. Skill acquisition is intrinsic motivation._](#-learning-motivation-learning-is-fun-vs-intrinsic-motivation)

I'm very interested in education and programming education and have been mentoring new graduates from the local programming boot camp in Irvine.

This talk by <a href="https://www.felienne.com/" target='_blank'>Felienne Hermans</a> resonated with me, and I wanted to highlight some of the insights I learned from her talk.

Hermans is an associate professor who heads the Programming Education Research Lab at the Leiden University Institute of Advanced Computer Science, and she speaks on "how to teach programming (and other things)" by sharing her experiences on teaching programming to children.

<iframe width="560" height="315" src="https://www.youtube.com/embed/g1ib43q3uXQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 👨🏻‍🏫 The common approach of teaching programming: Exploration and Experimentation

Most programmers teach programming through the same approach they, themselves, learned to program:

**Learning through self-exploration and experimentation.**

Especially for programmers who were born in the '80s (aka, the current generation of middle-aged professionals), the first introduction to programming was usually during their childhood through some programming book (there was no YouTube at this time). These books usually contain source code snippets of example programs that you manually type into a computer.

This process of learning was usually completely self-directed with no outside instruction. A process of reading code, writing code - and of course debugging any syntax errors caused by typos.

_(This described my first experience in programming. I remember coding along to "Sams Teach Yourself C++ in 24 Hours" which I picked up from the library in middle school)._

So when it comes to teaching other students how to program, we instinctively default to repeating our experience that has clearly shown past empirical evidence of success.

> **"I know how to program, and I learned programming mainly through self-exploration. So this is probably how programming should be taught..."**

_(In fact, when I did my AP programming classes in high school, my teacher even structured the class with the emphasis on self-exploration with a programming book. There was minimal verbal instruction, and his role was mainly to answer questions if we got stuck.)_

## 👨🏻‍🏫 The common approach of teaching problem-solving: Students should solve problems

One of the central goals in programming education is to teach students how to become problem solvers. Programming, after all, requires problem-solving.

The common belief is that students will improve their problem-solving through the practice of solving programming problems.

**More importantly, students should solve the problems by themselves before seeing the solution. If students see how to solve the problem _before_ they try the problem themselves, they'll lose the learning opportunity.**

> **"I want students to learn to become problem solvers, so they should solve problems."**
>
> **"So here are some programming problems. I won't tell you the solution, but I want you to learn problem-solving by solving problems."**

This belief reinforces the concept of approaching teaching through a primarily self-exploration environment.

## 📝 The "constructionist view": A history on the Exploration and Experimentation approach

> **Don't explain problem solutions upfront; Let kids explore and discover the solutions by themselves.**

A figurehead in the history of programming education is, <a href="https://en.wikipedia.org/wiki/Seymour_Papert" target='\_blank'>Seymore Papert</a>.

Papert was the creator of LOGO, one of the first programming languages designed for teaching programming to children. Later on, he collaborated with LEGO to create the popular MINDSTORMS blocks, a line of LEGO bricks that are embedded with programmable computers to teach programming to children.

He spent most of his career teaching at MIT and is known for the constructionist view in education.

The constructionist view believes that children learn best through tinkering and unstructured activities that resemble play, a form of self-guided problem-solving, much as children do in non-school situations.

This view states that by explaining the solution to a problem, we actually take away the opportunity for a child to discover the learning moment.

Papert had such a foundational role in programming education for children that his constructionist view continues to be ingrained in many programming education programs.

## 🙋🏻‍♂️ Students don't become an expert by doing expert things

The erroneous thinking in the constructionist view for teaching problem-solving by having students practice problem-solving is that problem-solving is a skill.

So teaching problem-solving should be approached as skills-based learning.

Consider applying this same constructivist approach to other skills-based learning situations:

### Tennis:

**"I want students to learn to become tennis players, so they should play tennis matches."**

**"So here's a tennis racquet and a ball. I won't tell you how it works, but I want you to become a tennis player by playing lots of tennis matches."**

### Guitar:

**"I want students to learn to become guitar players, so they should play guitar performances.**

**"So here's a guitar. I won't tell you how it works, but I want you to become a guitar player by playing lots of guitar performances."**

It's obvious that we don't approach education for other skills-based through a constructionist view.

## 💡 Students learn through deliberate explanation and skills-based practice

In fact, when we want to teach students to become experts in situations of skills-based learning we employ practice. More specifically, we use the deliberate practice of broken-down "chunked" skills.

In these cases, the sum of the parts is greater than the whole.

**To become a guitar player, we don't have students play performances every day. Students should practice scales, chords, music theory, and strumming patterns.**

**To become a tennis player, we don't have students play lots of tennis matches. Students should practice racquet technique and drills.**

> Outside of the context of teaching problem-solving, it's clearly understood that skills improvement is based on **deliberate instruction of "chunked" skills and deliberate practice of "chunked" skills.**

## 💡 Students learn problem-solving skills through acquiring problem-solving "chunks"

In 2006, a study was done to measure the effectiveness of the constructivist approach of education for problem-based teaching:

<a href='http://mrbartonmaths.com/resourcesnew/8.%20Research/Explicit%20Instruction/Why%20minimal%20guidance%20instruction%20does%20not%20work.pdf' target='_blank'>"Why Minimal Guidance During Instruction Does Not Work" - An Analysis of the Failure of Constructivist, Discovery, Problem-Based, Experiential, and Inquiry-Based Teaching</a>.

Contrary to the constructivist view, the study found that in learning algebra:

> **Providing worked examples of problem sets was a superior substitute for exploratory problem-solving learning.**

In the study, two groups of students were presented with the same algebra problem:

```
Given:
  a = 7 - 4a

Question:
  Solve for a
```

**Group 1: Exploratory learning towards problem-solving**

Students in Group 1 were just given the problem to solve, following the constructivist approach to learning.

**Group 2: Instructed learning towards problem-solving**

Students in Group 2 were first given a step-by-step example and explanation for solving an algebra problem of this specific pattern.

```
Given:
  a = b - ca

Solution pattern:
  a = b - ca
  a + ca = b
  a(a + c) = b

  a = b / (1 + c)
```

After studying the solution pattern, the students in Group 2 were given the same problem presented to Group 1.

### Performance results between Group 1 and Group 2

Not surprisingly, more students in Group 2 solved the problem faster. Moreover, the students in Group 2 solved it significantly faster in just 1/5th of the time that it took students in Group 1 to solve the problem.

The common argument from teachers against the improved performance of Group 2 students is usually:

**"Well, of course, the students in Group 2 performed better - they received the answer solution before they started!"**

However, what is interesting is that when both groups of students were then given new and different algebra problems, the students in Group 2 also solved these problems faster too.

## ⏳ Cognitive load reduces our limited working memory

Our brain has a limited working (short-term) memory that can only store about 2-6 items of information. However, this working memory is quickly used up when we approach novel problem-solving tasks.

For example, compare the effort required to memorize two different sets of characters that contain the same number of characters per group.

The first set of characters:

```
\*&     &@)\_     1@07
```

Now try to memorize this set of characters:

```
cat     loves     cake
```

We can tangibly feel the increased cognitive load of trying to memorize the first set of characters. It feels like the characters don't fit in the brain - our working memory is getting overloaded (unless you have a photographic memory).

In the second set of characters, `cat loves cake`, our brain doesn't try to save the individual characters because we've learned to "chunk" the letters into words so we can quickly read and store the 3 chunks.

## 💡 Equip students with problem-solving "chunks"

> **When students were provided with problem-solving pattern "chunks", they experienced a lower cognitive load.**
>
> **This allowed students to reflect, review, and learn from the first problem set and apply these new skills to new and different problems.**

Contrary to the constructivist view, merely presenting students with novel problem-solving situations without prior problem-solving "chunks" increased the students' cognitive load and their available working memory was decreased.

There was no leftover working memory to reflect and learn from the experience of solving the first problem set.

**This is the crux of the approach to teaching problem-solving skills in programming - providing students with problem-solving pattern "chunks" increases the capacity and effectiveness of their working memory that can be applied to new programming problems.**

> **"If we want to teach students to become problem solvers, we should equip them with problem-solving patterns."**

There is another study, <a href='https://www.researchgate.net/publication/220425310_The_Case_for_Case_Studies_of_Programming_Problems' target='_blank'>"The Case for Case Studies of Programming Problems"</a>, where 3 groups of high-school programming students were presented with the same programming problem.

**Group 1: Student solves the problem and reviews a post solution method**

Students in Group 1 were instructed to write their code solution to the programming problem.

Afterwards they were given a case study with the solution method.

**Group 2: Student solves the problem and reviews a post solution method with explanations**

Students in Group 2 were instructed to write their code solution to the programming problem.

Afterward they were given a case study with the solution method which also included an explanation of why the problem was solved in that approach.

**Group 3: Didn't write any code - Only instruction lead explanations of the solution method**

Students in Group 3 **did not write their code solution** to the programming problem.

They were only provided teacher lead explanations of the solution method case study and why the problem was solved in that approach.

### Performance results

After the 3 groups completed reviewing the programming problem solutions, the students were given another new different programming problem to solve.

**What is surprising, is that both Group 2 and Group 3 students performed equally well on the new programming problem; remember - Group 3 students had not attempted to code their solution during the learning process.**

From my own high-school and university experience, most teachers seem to prefer the teaching approach of Group 1 or Group 2. Students should solve the problem by themselves, before receiving the solution set. The belief is that students gain the learning moment by solving problems on their own.

> **The main basis of learning came from reviewing the explanations of solution methods. It didn't matter if students attempted to apply their solution before seeing the solution set.**

Learning the solutions explanations didn't require a heavy cognitive load, allowing for available working memory to store these new problem-solving "chunks".

## 💡 The importance of correct mental models

_The following example was taken from Dan Abramov's article series: <a href='http://justjavascript.com/'>justjavascript.com</a>._

Nobel Memorial Laureate in Economic Sciences, Daniel Kahneman, has a related concept to mental models and chunking, called, "thinking, fast and slow". "Fast" and "slow" thinking describes the cognitive biases associated with our brain's two different “systems” of thinking.

**"System 1" is fast, instinctive; and "System 2" is slower, more deliberate, and logical.**

The “fast” system is adept at pattern matching (which is necessary for survival) and “gut reactions”. But it’s not good at planning.

The “slow” system is responsible for complex step-by-step reasoning. It lets us plan future events, engage in arguments, or follow mathematical proofs.

> **Since we have limited working memory, our brains will rely on the “fast” system whenever possible by "chunking" concepts with an approximation that is easier to understand.**
>
> **These approximation "chunks" of how we understand something to work are known as “mental models”.**

**We default to our “fast” mental model thinking system even when dealing with intellectual tasks like programming.**

Mental models are great - they allow us to understand the vast amounts of information in our environment; however - the shortcoming of mental models is that they are approximations and the wrong approximations can be created.

Our mental model approximations are created from analogies from the real world - some analogies are repurposed from other fields we learned first, like numbers from math. Some analogies even overlap and contradict each other, but our mental models still help make sense of what’s happening in the code.

**So our mental model "chunks" of fundamental programming concepts must be correct, and incorrect mental models are usually the root cause of bugs in our code.**

> **Our mental model is core to our understanding of what is happening in code.**

Consider this snippet of code:

Read the code and determine the values of `a` and `b` after it runs:

```javascript
// JavaScript

let a = 10;
let b = a;
a = 0;
```

_Scroll down and we'll walk through the code together..._

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

- Declare a variable called `a`.
- Point the variable `a` to the value `10`.

```javascript
let a = 10;
```

- Declare a variable called `b`.
- Point the variable `b` to the value pointed to by `a`.

  - The variable `a` points to the value `10`.

- Point the variable `b` to the value `10`.

```javascript
let b = a;
```

- Point the variable `a` to the value `0`.

```javascript
a = 0;
```

**So after the cod has run, variable `a` is `0`, and the variable `b` is `10`.** _Yes, this is the answer._

## 💡 Reading code aloud improves comprehension of code

> **When we read code, we express the mental model that we hold and could see that how something sounds affects how we interpret the meaning.**

In your mental model, you may have used different terms for `=` variable assignment operation.

```javascript
let a = 10;
```

Maybe you said:

- _"set variable `a` to the number `10`"_
- _"store the number `10` in the variable `a`"_

It's common to think of variables as "storing" something. However, in JavaScript, this mental model of "storing" things causes issues when we consider the next line of code.

```javascript
let b = a;
```

Maybe you said:

- _"store the variable `a` in variable `b`"_
- _"assign variable `b` to the variable `a`"_
- _"`b` equals `a`"_.

All these expressions of a wrong mental model may have lead you to an incorrect answer.

Let's consider this example - read the sentence:

😢 _"I have a tear..."_

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

😢 _"I have a tear..."_

_"in my pants."_

At first, you probably read _"tear"_ as a "tear drop". However, when we connect the whole sentence, we go back and re-read the word, _"tear"_, with the pronunciation to fit the meaning of the sentence.

**Similarly, the mental models we hold influence the words we use to read and understand code.**

This was something I learned to do early on from one of my teachers, who would ask students in the class read code aloud. By hearing the words we used, my teacher could quickly identify any wrong mental models we held.

> **By teaching students to read code aloud with the correct words, we construct the right mental models to understand code.**

## 🎉 Learning Motivation: "Learning is fun" vs "intrinsic motivation"

There's been a movement towards making programming education accessible by conveying that learning programming is "fun", or "easy", through a variety of gamified platforms like children's coding games.

While I support introducing children early to programming, I believe there is a better approach to making programming enjoyable for children.

> **The fallacy with presenting the idea that learning programming is "fun" or "easy" is that programming is not always fun, and programming is definitely not easy. Learning is hard work.**
>
> **When students start to hit the harder programming concepts, or when they're trying to track down a missing semi-colon, or closing brace, that is definitely not fun - it's frustrating!**

My 6-year-old nephew has one of these gamified programming education toys, <a href="https://www.playosmo.com/en/coding/">Osmo's, Coding Awbie</a>.

Coding Awbie describes itself as:
_Coding Awbie teaches logic skills and problem-solving, and it helps kids succeed in an increasingly digital world. Coding Awbie is the easiest way to introduce coding to your child._

During the first few weeks, the game was really engaging, and I thought that this was a great way to get children interested in programming.

However, I asked a few weeks later how my nephew was progressing in his game and found out that he had lost interest. When the programming became harder the motivation to continue to learn dissipated.

> **If a student is told that learning programming is fun, it's easy for the student to lose interest when that learning process is no longer "fun" in the gamified sense.**

## 💪🏽 Skill acquisition is intrinsic motivation

**It doesn't matter if students are having fun learning. What is motivating is knowing that what they're learning will make them stronger.**

Unconsciously, adults and children already understand this concept that learning isn't always fun.

I've been doing a laddered pushups program to build up strength to reach 100 pushups.

Doing the pushups is definitely not fun. It is much more fun to be sitting on the couch watching YouTube. What is motivating is seeing the progression that I can now do 15 pushups this week, when I could only do 5 the last week.

Children have experienced this too.

Learning to ride a bike isn't fun; they fall a lot and it hurts. But they are motivated seeing that they ride down the driveway this week, when they could only ride a few feet the other week.

**The general belief is that motivation leads to skill acquisition; that if children are motivated to learn, they will acquire a skill.**

**Seeing the tangible progression of acquiring a skill is motivation. Realizing that we're learning is intrinsic motivation itself.**

> **Show children that they are learning, that will bring the motivation. Not the other way around.**
>
> **A more wholistic approach to making programming accessible to children is to guide them to build interesting things with the programming skills they're learning.**
