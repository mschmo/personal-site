title: If You Can't Formulate, Simulate
images: True
tags: [biology, rust]
styles: []
scripts: [utility.js]

For the last week or so I've been working through some bioinformatics problems on [Rosalind](http://rosalind.info/), an educational site that provides hundreds of programming challenges. Many of those geared toward computational biology, while a few others regarding general Python and algorithms. Regardless of whether your background is in biology or computer science, Rosalind does

2. Introduce the problem in question. Mendel and all that. http://rosalind.info/problems/iprb/

> **Given:** Three positive integers k, m, and n, representing a population containing k+m+n organisms: k individuals are homozygous dominant for a factor, m are heterozygous, and n are homozygous recessive.
 **Return:** The probability that two randomly selected mating organisms will produce an individual possessing a dominant allele (and thus displaying the dominant phenotype). Assume that any two organisms can mate.

Even though I work with data for a living, I straight up suck when it comes to statistics. 

There's one problem here. I suck at any mathematics, especially anything involving probability.

<pre class="get-away"><code class="language-rust">
extern crate rand;

use rand::random{Rng};

const MAX_SIMS: u32 = 1_000_000;

enum Allele {
	Dom,
	Rec
}

enum GenoType {
	HomD,
	Het,
	HomR
}

imple GenoType {
	fn rand_allele(&self, &mut rng) -> Allele {
		match &self {
			GenoType::HomD => Allele::Dom,
			GenoType::HomR => Allele::Rec,
			GenoType::Het => if rng:: < 0.5 { Allele::Dom } else { Allele:Rec }
		}
	}
}

struct SimResults {
	hom_d_children: u32,
	het_children: u32,
	hom_r_children: u32
}

impl SimResults {
	fn new() -> SimResults {
		SimResults {
			hom_d_children: 0,
			het_children: 0,
			hom_r_children: 0
		}
	}
}

fn get_geno_type(a1: Allele, a2: Allele) -> GenoType {
	match (a1, a2) {
		(Allele::Dom, Allele::Dom) => GenoType::HomD,
		(Allele::Dom, Allele::Rec) | (Allele::Rec, Allele::Dom) => GenoType::Het,
		(Allele::Rec, Allele::Rec) => GenoType::HomR,
	}
}

fn run_simulation(hom_d: u32, het: u32, hom_r: u32) -> SimResults {
	let mut pop: Vec<GenoType> = Vec::new();
	pop.extend_from_slice(&vec![GenoType::HomD; hom_d]);
    pop.extend_from_slice(&vec![GenoType::Het; het]);
    pop.extend_from_slice(&vec![GenoType::HomR; hom_r]);
    
    let mut rng = rand_range();
    let mut results = SimResults::new();
    for _ in 0..MAX_SIMS {
    	let sample: [GenoType; 2] = seq.rand_sample(&mut rng, pop, 2).unwrap().split_in_two();
    	match sample {
    		[GenoType::HomD, GenoType::HomD] => results.hom_d_children += 1,
    		[GenoType::HomR, GenoType::HomR] => results.hom_r_children += 1,
    		[pat, mat] => {
    			// Get random allele from both
    			pat_a = pat.rand_allele(&mut rng);
    			mat_a = pat.rand_allele(&mut rng);
    			match get_geno_type(pat_a, mat_a) {
    				GenoType::HomD => results.hom_d_children += 1,
    				GenoType::Het => results.het_children += 1,
    				GenoType::HomR => results.hom_r_children += 1,
    			}
    		}
    	}
    }
    results
}
</code></pre>

<pre class="get-away"><code class="language-rust"><span class="hide-comment"># rep(x, times, ...) function replicates {x} {times} number of times
# So domi is an empty list of 1 million length
</span>domi <- rep(NA, 1000000)

<span class="hide-comment"># c(...) is the "concatenate" function, and combines its items
# So now pop is a list that looks like [AA (* 16), Aa (* 17), aa(*15)]</span>
pop <- c(rep("AA", 16), rep("Aa", 17),rep("aa", 15))

# Begin an iteration ({x} = step) from 1 to 1 million
for(x in 1:length(domi)) {
    # sample(x, size, ...) takes a "sample" of size {size} from elements in {x}
    # So now pair is a random permutation of 2 elements from pop (e.g. ["AA", "Aa"])
    pair <- sample(pop, 2)

    # {domi[x] <-} Insert into the {domi} list at index = step of the iteration, so that we record each simulation
    # strsplit(x, split, ...) split = NULL to mean split = character(0)
    # This takes a random genotype from each allele in {pair}, and returns TRUE if at least one is "A"
    domi[x] <- sample(strsplit(pair[1], NULL)[[1]], 1) == "A" | sample(strsplit(pair[2], NULL)[[1]], 1) == "A"
}

# This would be the percentage of grabbing a two random people from the pop at least 1 being dominant (AA) or het (Aa)
# so... I don't know how that works exactly
sum(domi)/length(domi)
</code></pre>

<span class="hide-comment">This is a comment</span>

<button class="toggle">Toggle</button>

4. Begin implementation of simulator.

5. Conclusion: Show results. Discuss alternative solutions.

#### References, Inspirations and Further Reading
1. Idk